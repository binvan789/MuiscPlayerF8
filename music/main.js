const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const player = $('.player')
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playlist = $('.playlist');
const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const app = {
  currentIndex:  0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "100 Years Love",
      singer: "NamDuc Official",
      path: `assets/src/100-years-love-namduc-official-audio.mp3`,
      image: "https://profiledata.net/file/img/media/fe4805d841ed0a5d8cdfce91c9ca537a.png.jpeg.jpeg"
    },
    {
      name: "Bên Trên Tầng Lầu",
      singer: "Tăng Duy Hưng",
      path: "assets/src/ben-tren-tang-lau-official-lyric-video.mp3",
      image:
        "https://i.ytimg.com/vi/2MUfA2g87vo/maxresdefault.jpg"
    },
    {
      name: "Mặt Mộc",
      singer: "Phạm Nguyên Ngọc x VANH",
      path:
        "assets/src/mat-moc-pham-nguyen-ngoc-x-vanh-x-an-nhi-original.mp3",
      image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/b/8/b/1/b8b1fbaed421c134a700615b7069aa61.jpg"
    },
    {
      name: "100 Years Love",
      singer: "NamDuc Official",
      path: `assets/src/100-years-love-namduc-official-audio.mp3`,
      image: "https://profiledata.net/file/img/media/fe4805d841ed0a5d8cdfce91c9ca537a.png.jpeg.jpeg"
    },
    {
      name: "Bên Trên Tầng Lầu",
      singer: "Tăng Duy Hưng",
      path: "assets/src/ben-tren-tang-lau-official-lyric-video.mp3",
      image:
        "https://i.ytimg.com/vi/2MUfA2g87vo/maxresdefault.jpg"
    },
    {
      name: "Mặt Mộc",
      singer: "Phạm Nguyên Ngọc x VANH",
      path:
        "assets/src/mat-moc-pham-nguyen-ngoc-x-vanh-x-an-nhi-original.mp3",
      image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/b/8/b/1/b8b1fbaed421c134a700615b7069aa61.jpg"
    }
  ],
  setConfig: function(key, item) {
    this.config[key] = item;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function() {
    const htmls = this.songs.map((song,index) => {
        return `
        <div class="song ${index === this.currentIndex? 'active': ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
      })
      $('.playlist').innerHTML = htmls.join('')
  },
  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvent: function() {
     // Xử lí quay
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause();
    const _this = this;
    // Xử lí phóng to thu nhỏ
    const cdWidth = cd.offsetWidth;
    document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newWidth = cdWidth - scrollTop;
        cd.style.width = newWidth > 0 ? newWidth + 'px': 0;
        cd.style.opacity = newWidth / cdWidth;
    }
    // Xử lí click play
    playBtn.onclick = function() {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      // Music play
      audio.onplay = function() {
        _this.isPlaying = true;
        player.classList.add('playing');
        cdThumbAnimate.play();
      }
      // Music pause
      audio.onpause = function() {
        cdThumbAnimate.pause();
        _this.isPlaying = false;
        player.classList.remove('playing');
      }

      // Thời gian chạy của progress
      audio.ontimeupdate = function() {
        if (audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
          progress.value = progressPercent;
        }
      }
      // Xử lí khi tua
      progress.onchange = function(e) {
        const seekTime = e.target.value * audio.duration / 100;
        audio.currentTime = seekTime;
      }
    }
    // Xử lí next
    btnNext.onclick = function() {
      if (_this.isRandom) {
        _this.randomSong();
      } 
      else {
        _this.nextSong();
      }

      _this.render();
      _this.scrollToActiveSong();
    }
    // Xử lí prev
    btnPrev.onclick = function() {
      if (_this.isRandom) {
        _this.randomSong();
      } 
      else {
        _this.prevSong();
      }

      _this.render();
      _this.scrollToActiveSong();

    }
    
    // Xử lí random
    btnRandom.onclick = function() {
      _this.isRandom = !_this.isRandom;
      btnRandom.classList.toggle('active', _this.isRandom);
      _this.setConfig('isRandom', _this.isRandom);
    }
    // Xử lí end
    audio.onended = function() {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    }
    // Xử lí repeat
    btnRepeat.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      btnRepeat.classList.toggle('active');
      _this.setConfig('isRepeat', _this.isRepeat);
    }
    // Xử lí active playlist
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode || e.target.closest('.option')) {
        if(songNode && !e.target.closest('.option')) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
        }
      }
      if (e.target.closest('.option')) {
        alert('3 chấm :))')
      }
    }
  },
  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 300);
  },
  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.background = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function() {
    let newCurrent
    do {
      newCurrent = Math.floor(Math.random() * this.songs.length)
    } while (newCurrent === this.currentIndex)
    this.currentIndex = newCurrent;
    this.loadCurrentSong();
  },
 
  start: function() {
    this.loadConfig();
    this.defineProperties();
    this.loadCurrentSong();
    this.handleEvent();
    this.render();

    btnRandom.classList.toggle('active', this.isRandom);
    btnRepeat.classList.toggle('active', this.isRandom);
  }

}

app.start();
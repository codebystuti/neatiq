const app = Vue.createApp({
  data() {
    return {
      isDark: true,
      headerScrolled: false,
    };
  },

  provide() {
    return {
      store: quizStore,
    };
  },

  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      if (this.isDark) {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
      try {
        localStorage.setItem('neatiq_theme', this.isDark ? 'dark' : 'light');
      } catch (e) { /* storage full — theme just won't persist */ }
    },

    initTheme() {
      try {
        const saved = localStorage.getItem('neatiq_theme');
        if (saved === 'light') {
          this.isDark = false;
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (e) { /* localStorage blocked — use default dark theme */ }
    },

    setupScrollListeners() {

      window.addEventListener('scroll', () => {
        this.headerScrolled = window.scrollY > 10;
        
      }, { passive: true });      
    },
  },

  mounted() {
    this.initTheme();
    this.setupScrollListeners();
    quizStore.loadSettings();
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      document.documentElement.classList.add('safari');
    }
  },
});

app.component('feedback-panel', FeedbackPanel);
app.component('quiz-progress', QuizProgress);

app.use(router);
app.mount('#quiz-app');

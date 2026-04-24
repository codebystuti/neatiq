const QuizLanding = {
  name: 'QuizLanding',

  components: {
    SettingsPanel,
    ScoreHistory,
  },

  inject: ['store'],

  data() {
    return {
      landingPage: QUIZ_DATA.landing_page,
      showSettings: false,
    };
  },

  methods: {
    openSettings() {
      this.showSettings = true;
    },

    runEntryAnimation() {
      if (typeof Motion === 'undefined') return;
      const { animate, stagger } = Motion;

      const image = this.$el.querySelector('.landing__image-col');
      const items = this.$el.querySelectorAll(
        '.landing__title, .landing__intro, .landing__body, .landing__notes, .landing__actions'
      );

      if (image) {
        animate(image, { opacity: [0, 1], x: [-30, 0] }, { duration: 1.2, easing: [0.22, 1, 0.36, 1] });
      }
      if (items.length) {
        animate(items, { opacity: [0, 1], y: [20, 0] }, { duration: 1.0, delay: stagger(0.15, { start: 0.25 }), easing: [0.22, 1, 0.36, 1] });
      }
    },

    onStart(settings) {
      this.showSettings = false;

      // save settings to the shared store
      this.store.setSettings(settings);
      this.store.startQuiz();

      // wait for modal close animation to finish before navigating
      setTimeout(() => {
        this.$router.push({
          name: 'quiz',
          query: {
            count: settings.questionCount,
            images: settings.showImages ? '1' : '0',
            feedback: settings.instantFeedback ? '1' : '0',
            t: Date.now(),
          },
        });
      }, 600);
    },
  },

  mounted() {
    // reset store when coming back to landing
    this.store.reset();

    const qIcon = document.querySelector('.site-header__q-icon');
    if (qIcon) qIcon.classList.add('site-header__q-icon--intro');

    this.$nextTick(() => this.runEntryAnimation());

    this._themeObserver = new MutationObserver(() => {
      this.$nextTick(() => this.runEntryAnimation());
    });
    this._themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  },

  beforeUnmount() {
    if (this._themeObserver) this._themeObserver.disconnect();
  },

  template: `
    <section class="landing" aria-label="Quiz introduction">
      <div class="landing__inner container">
        <div class="landing__image-col">
          <div class="landing__image-wrap">
            <img
              v-if="landingPage.image && landingPage.image.url"
              :src="landingPage.image.url"
              :alt="landingPage.image.alt"
              class="landing__img"
            />
          </div>
        </div>
        <div class="landing__content-col">
          <h1 class="landing__title">{{ landingPage.title }}</h1>
          <p class="landing__intro">{{ landingPage.intro_text }}</p>
          <div class="landing__body" v-html="landingPage.content"></div>
          <div v-if="landingPage.notes" class="landing__notes" v-html="landingPage.notes"></div>

          <div class="landing__actions">
            <button class="btn btn--primary landing__cta-btn" @click="openSettings">
              {{ landingPage.link_text }}
            </button>
            <score-history />
          </div>
        </div>
      </div>

      <settings-panel
        :visible="showSettings"
        @close="showSettings = false"
        @start="onStart"
      />
    </section>
  `,
};
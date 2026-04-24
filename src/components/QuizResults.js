const QuizResults = {
  name: 'QuizResults',

  components: {
    AnswerReview,
  },

  inject: ['store'],

  data() {
    return {
      showResults: false,
      displayScore: 0,
      arcOffset: 754,
      knobAngle: 0,
      meterAnimating: false,
      questions: QUIZ_DATA.questions,
      resultsPage: QUIZ_DATA.results_page,
    };
  },

  computed: {
    finalScore() {
      return this.store.finalScore || {};
    },
    scoreOutOf10() {
      return this.finalScore.scoreOutOf10 || 0;
    },
    level() {
      return this.finalScore.level || 'beginner';
    },
    quizResponses() {
      return this.store.responses || [];
    },
    currentResultsLevel() {
      return this.resultsPage[this.level] || null;
    },
    currentArticles() {
      return (this.resultsPage[this.level + '_articles'] || []).slice(0, 3);
    },
    displayTotalQuestions() {
      return 10;
    },
    targetArcOffset() {
      const circumference = 754;
      return Math.round(circumference - (this.scoreOutOf10 / 10) * circumference);
    },
    targetKnobAngle() {
      return (this.scoreOutOf10 / 10) * 360;
    },
  },

  mounted() {
    if (!this.store.quizCompleted) {
      this.$router.push({ name: 'landing' });
      return;
    }

    setTimeout(() => {
      this.showResults = true;
    }, 100);

    this.$watch('showResults', (val) => {
      if (!val) return;
      this.$nextTick(() => {
        const arc = this.$el.querySelector('.results-meter__arc');

        if (arc) arc.style.transition = 'none';
        this.meterAnimating = false;
        this.arcOffset = 754;
        this.knobAngle = 0;

        this.$el.offsetHeight;

        requestAnimationFrame(() => {
          // re-enable transitions
          if (arc) arc.style.transition = '';
          this.meterAnimating = true;

          requestAnimationFrame(() => {
            this.arcOffset = this.targetArcOffset;
            this.knobAngle = this.targetKnobAngle;
            this.animateScoreCount();
            setTimeout(() => this.setupScrollAnimations(), 200);
          });
        });
      });
    }, { once: true });

    this._themeObserver = new MutationObserver(() => {
      this.replayMeterAnimation();
    });
    this._themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  },

  beforeUnmount() {
    if (this._scrollObserver) this._scrollObserver.disconnect();
    if (this._themeObserver) this._themeObserver.disconnect();
  },

  methods: {
    animateScoreCount() {
      const target = this.scoreOutOf10;
      this.displayScore = 0;
      if (target <= 0) return;
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        this.displayScore = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },

    replayMeterAnimation() {
      const arc = this.$el.querySelector('.results-meter__arc');

      // disable transitions and snap to zero
      if (arc) arc.style.transition = 'none';
      this.meterAnimating = false;
      this.arcOffset = 754;
      this.knobAngle = 0;
      this.displayScore = 0;

      this.$nextTick(() => {
        this.$el.offsetHeight;

        requestAnimationFrame(() => {
          // re-enable transitions
          if (arc) arc.style.transition = '';
          this.meterAnimating = true;

          requestAnimationFrame(() => {
            this.arcOffset = this.targetArcOffset;
            this.knobAngle = this.targetKnobAngle;
            this.animateScoreCount();
          });
        });
      });

      // Re-trigger scroll animations
      if (this._scrollObserver) this._scrollObserver.disconnect();
      this.$nextTick(() => this.setupScrollAnimations());
    },

    setupScrollAnimations() {
      const hasMotion = typeof Motion !== 'undefined';
      const animate = hasMotion ? Motion.animate : null;

      const articles = this.$el.querySelectorAll('.results-article');
      const ctaCards = this.$el.querySelectorAll('.results-cta__card');
      const articleTitle = this.$el.querySelector('.results-articles__title');
      const ctaTitle = this.$el.querySelector('.results-cta__title');

      const allTargets = [...articles, ...ctaCards];
      if (articleTitle) allTargets.push(articleTitle);
      if (ctaTitle) allTargets.push(ctaTitle);

      articles.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-40px)';
      });

      ctaCards.forEach(el => {
        el.style.opacity = '0';
      });

      if (ctaCards.length >= 2) {
        ctaCards[0].style.transform = 'translateX(-40px)';
        ctaCards[1].style.transform = 'translateX(40px)';
      }

      if (articleTitle) {
        articleTitle.style.opacity = '0';
        articleTitle.style.transform = 'translateY(-20px)';
      }
      if (ctaTitle) {
        ctaTitle.style.opacity = '0';
        ctaTitle.style.transform = 'translateY(-20px)';
      }

      this._scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          this._scrollObserver.unobserve(el);

          if (el.classList.contains('results-articles__title') || el.classList.contains('results-cta__title')) {
            if (animate) {
              animate(el, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
            } else {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
              el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            }

            if (el.classList.contains('results-articles__title') && articles.length) {
              articles.forEach((card, i) => {
                setTimeout(() => {
                  if (animate) {
                    animate(card, { opacity: [0, 1], y: [-40, 0] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
                  } else {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                  }
                }, i * 150);
              });
            }

            if (el.classList.contains('results-cta__title') && ctaCards.length >= 2) {
              setTimeout(() => {
                if (animate) {
                  animate(ctaCards[0], { opacity: [0, 1], x: [-40, 0] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
                  animate(ctaCards[1], { opacity: [0, 1], x: [40, 0] }, { duration: 0.7, delay: 0.1, easing: [0.22, 1, 0.36, 1] });
                } else {
                  ctaCards[0].style.opacity = '1';
                  ctaCards[0].style.transform = 'translateX(0)';
                  ctaCards[0].style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                  ctaCards[1].style.opacity = '1';
                  ctaCards[1].style.transform = 'translateX(0)';
                  ctaCards[1].style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                }
              }, 150);
            }
          }
        });
      }, { threshold: 0.15 });

      if (articleTitle) this._scrollObserver.observe(articleTitle);
      if (ctaTitle) this._scrollObserver.observe(ctaTitle);
    },

    retryQuiz() {
      this.store.reset();
      this.$router.push({ name: 'landing' });
    },

    shareOn(platform) {
      const text = 'I scored ' + this.scoreOutOf10 + '/10 on the NeatIQ Quiz! How well do you know alcohol?';
      const url = window.location.origin + window.location.pathname;
      const links = {
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
        whatsapp: 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url),
        email: 'mailto:?subject=My NeatIQ Score&body=' + encodeURIComponent(text + '\n\n' + url),
      };
      if (links[platform]) window.open(links[platform], '_blank', 'noopener');
    },

    getPillClass(category) {
      if (!category) return 'tag--alcohol';
      const c = category.toLowerCase();
      if (c.includes('body')) return 'tag--body';
      if (c.includes('mind')) return 'tag--mind';
      if (c.includes('relationship')) return 'tag--relationships';
      return 'tag--alcohol';
    },
  },

  template: `
    <transition name="results-reveal">
      <div v-if="showResults" class="results-page">

        <div class="results-bg" aria-hidden="true">
          <div class="results-bg__base"></div>
          <div class="results-bg__blob results-bg__blob--1"></div>
          <div class="results-bg__blob results-bg__blob--2"></div>
          <div class="results-bg__blob results-bg__blob--3"></div>
          <div class="results-bg__blob results-bg__blob--4"></div>
          <div class="results-bg__noise"></div>
        </div>

        <div class="results-bg__contours" aria-hidden="true">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
            <ellipse cx="900" cy="200" rx="150" ry="120" fill="none" stroke="var(--clr-gold)" stroke-width="1.5" />
            <ellipse cx="900" cy="200" rx="200" ry="160" fill="none" stroke="var(--clr-gold)" stroke-width="1.5" opacity="0.7" />
            <ellipse cx="900" cy="200" rx="260" ry="210" fill="none" stroke="var(--clr-gold)" stroke-width="1.5" opacity="0.5" />
            <ellipse cx="900" cy="200" rx="330" ry="270" fill="none" stroke="var(--clr-surface)" stroke-width="1.5" opacity="0.4" />
            <ellipse cx="200" cy="600" rx="100" ry="80" fill="none" stroke="var(--clr-muted)" stroke-width="1.5" opacity="0.6" />
            <ellipse cx="200" cy="600" rx="160" ry="130" fill="none" stroke="var(--clr-muted)" stroke-width="1.5" opacity="0.4" />
            <ellipse cx="200" cy="600" rx="230" ry="190" fill="none" stroke="var(--clr-muted)" stroke-width="1.5" opacity="0.3" />
          </svg>
        </div>

        <div class="results-content">

          <section class="results-score container">
            <div class="results-score__inner">
              <div class="results-score__left">
                <p class="results-score__tag">{{ resultsPage.banner_tag_title }}</p>
                <h2 v-if="currentResultsLevel" class="results-score__title">{{ currentResultsLevel.title }}</h2>
                <p v-if="currentResultsLevel" class="results-score__desc" v-html="currentResultsLevel.content"></p>
                <button class="btn btn--outline results-score__retake" @click="retryQuiz">
                  <i class="fa-solid fa-rotate-right" aria-hidden="true" style="margin-right: 6px;"></i>
                  Retake Quiz
                </button>
              </div>
              <div class="results-score__right">
                <div class="results-meter">
                  <svg viewBox="-5 -5 270 270" class="results-meter__svg">
                    <defs>
                      <filter id="knobGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="130" cy="130" r="116" class="results-meter__bg"/>
                    <circle cx="130" cy="130" r="120" fill="none" class="results-meter__track" stroke-width="8"/>
                    <circle cx="130" cy="130" r="120" fill="none" stroke="#C9A84C" stroke-width="8" stroke-linecap="round" stroke-dasharray="754" :stroke-dashoffset="arcOffset" transform="rotate(-90 130 130)" class="results-meter__arc"/>
                    <g class="results-meter__knob-group" :style="'transform: rotate(' + knobAngle + 'deg); transform-origin: 130px 130px;' + (meterAnimating ? ' transition: transform 3.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;' : '')">
                      <circle cx="130" cy="10" r="12" fill="#C9A84C" opacity="0.3" filter="url(#knobGlow)"/>
                      <circle cx="130" cy="10" r="7" fill="#C9A84C" class="results-meter__knob"/>
                      <circle cx="130" cy="10" r="3" fill="#FFFFFF" opacity="0.6"/>
                    </g>
                    <text x="130" y="155" text-anchor="middle" class="results-meter__score">{{ displayScore }}<tspan class="results-meter__denom">/{{ displayTotalQuestions }}</tspan></text>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <answer-review
            :responses="quizResponses"
            :questions="questions"
          />

          <section v-if="currentArticles && currentArticles.length > 0" class="results-articles container">
            <h2 class="results-articles__title" v-html="resultsPage.articles_title"></h2>
            <div class="results-articles__grid">
              <a
                v-for="(article, index) in currentArticles"
                :key="index"
                :href="article.url"
                class="results-article glass-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="results-article__image">
                  <img :src="article.image_url" :alt="article.image_alt" class="results-article__img" />
                </div>
                <div class="results-article__body">
                  <div class="results-article__meta">
                    <span class="results-article__pill" :class="getPillClass(article.category)">{{ article.category }}</span>
                    <span class="results-article__time">{{ article.read_time }} min read</span>
                  </div>
                  <h3 class="results-article__heading">{{ article.title }}</h3>
                  <span class="results-article__link">
                    Read article <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </span>
                </div>
              </a>
            </div>
          </section>

          <section v-if="resultsPage.bottom_cards" class="results-cta container">
            <h2 class="results-cta__title">{{ resultsPage.bottom_cards.title }}</h2>
            <div class="results-cta__grid">
              <div class="results-cta__card glass-card">
                <div class="results-cta__icon">
                  <i class="fa-solid fa-book-open" aria-hidden="true"></i>
                </div>
                <h3 class="results-cta__heading">{{ resultsPage.bottom_cards.first_card.title }}</h3>
                <p class="results-cta__body" v-html="resultsPage.bottom_cards.first_card.content"></p>
                <a :href="resultsPage.bottom_cards.first_card.link_url || '#'" class="btn btn--gold">
                  {{ resultsPage.bottom_cards.first_card.link_text }}
                  <i class="fa-solid fa-arrow-right" style="margin-left: 6px;" aria-hidden="true"></i>
                </a>
              </div>
              <div class="results-cta__card glass-card">
                <div class="results-cta__icon">
                  <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
                </div>
                <h3 class="results-cta__heading">{{ resultsPage.bottom_cards.second_card.title }}</h3>
                <p class="results-cta__body" v-html="resultsPage.bottom_cards.second_card.content"></p>
                <div class="results-cta__share">
                  <button class="results-cta__share-btn" aria-label="Share on Facebook" @click="shareOn('facebook')">
                    <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
                  </button>
                  <button class="results-cta__share-btn" aria-label="Share on WhatsApp" @click="shareOn('whatsapp')">
                    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
                  </button>
                  <button class="results-cta__share-btn" aria-label="Share via Email" @click="shareOn('email')">
                    <i class="fa-regular fa-envelope" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>
    </transition>
  `,
};
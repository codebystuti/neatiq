const AnswerReview = {
  name: 'AnswerReview',

  props: {
    responses: { type: Array, default: () => [] },
    questions: { type: Array, default: () => [] },
  },

  data() {
    return {
      activeTab: 'detailed',
      currentPage: 0,
      slideDirection: 'right',
      barsAnimated: false,
      displayCorrect: 0,
      displayIncorrect: 0,
      displayAvgTime: 0,
      cardsPerPage: 3,
    };
  },

  computed: {
    quizResponses() {
      return this.responses.filter(r => r.questionType !== 'poll');
    },

    correctCount() {
      return this.quizResponses.filter(r => r.isCorrect).length;
    },

    incorrectCount() {
      return this.quizResponses.filter(r => !r.isCorrect).length;
    },

    timesPerQuestion() {
      const times = [];
      for (let i = 0; i < this.quizResponses.length; i++) {
        const curr = new Date(this.quizResponses[i].answeredAt).getTime();
        const prev = i === 0 ? (curr - 10000) : new Date(this.quizResponses[i - 1].answeredAt).getTime();
        const diff = Math.max(1, Math.round((curr - prev) / 1000));
        times.push(Math.min(diff, 60));
      }
      return times;
    },

    avgTime() {
      if (!this.timesPerQuestion.length) return 0;
      const sum = this.timesPerQuestion.reduce((a, b) => a + b, 0);
      return Math.round(sum / this.timesPerQuestion.length);
    },

    maxTime() {
      if (!this.timesPerQuestion.length) return 30;
      const raw = Math.max(...this.timesPerQuestion);
      return Math.ceil(raw / 10) * 10;
    },

    totalPages() {
      return Math.ceil(this.quizResponses.length / this.cardsPerPage);
    },

    visibleCards() {
      const start = this.currentPage * this.cardsPerPage;
      return this.quizResponses.slice(start, start + this.cardsPerPage);
    },
  },

  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'summary') {
        this.$nextTick(() => this.animateSummary());
      }
    },

    goToPage(index) {
      if (index === this.currentPage) return;
      this.slideDirection = index > this.currentPage ? 'right' : 'left';
      this.currentPage = index;
    },

    getExplanation(response) {
      const q = this.questions.find((q, i) => (i + 1) === response.questionNumber);
      if (!q) return '';
      if (q.question_type === 'multiple_choice') {
        return response.isCorrect ? (q.correct_answer_text || '') : (q.incorrect_answer_text || '');
      }
      if (q.question_type === 'drag_drop') {
        return response.isCorrect ? (q.drag_correct_answer_text || '') : (q.drag_incorrect_answer_text || '');
      }
      return '';
    },

    barHeight(index) {
      if (!this.barsAnimated) return '0%';
      const time = this.timesPerQuestion[index] || 0;
      return Math.round((time / this.maxTime) * 100) + '%';
    },

    animateSummary() {
      this.barsAnimated = false;
      this.displayCorrect = 0;
      this.displayIncorrect = 0;
      this.displayAvgTime = 0;

      setTimeout(() => {
        this.barsAnimated = true;
        this.animateCount('displayCorrect', this.correctCount, 800);
        this.animateCount('displayIncorrect', this.incorrectCount, 800);
        this.animateCount('displayAvgTime', this.avgTime, 800);
      }, 150);
    },

    animateCount(prop, target, duration) {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this[prop] = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },

    updateCardsPerPage() {
      const w = window.innerWidth;
      if (w < 640) this.cardsPerPage = 1;
      else if (w < 1024) this.cardsPerPage = 2;
      else this.cardsPerPage = 3;
      this.currentPage = 0;
    },

    onTouchStart(e) {
      this._touchStartX = e.touches[0].clientX;
    },

    onTouchEnd(e) {
      if (!this._touchStartX) return;
      const diff = this._touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && this.currentPage < this.totalPages - 1) {
          this.slideDirection = 'right';
          this.currentPage++;
        } else if (diff < 0 && this.currentPage > 0) {
          this.slideDirection = 'left';
          this.currentPage--;
        }
      }
      this._touchStartX = null;
    },
  },

  mounted() {
    this.updateCardsPerPage();
    window.addEventListener('resize', this.updateCardsPerPage);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateCardsPerPage);
  },

  template: `
    <div class="review-section">
      <div class="container">

        <div class="review-tabs">
          <h2 class="review-tabs__title">Performance Breakdown</h2>
          <div class="review-tabs__pills">
            <button
              class="review-tabs__pill"
              :class="{ 'review-tabs__pill--active': activeTab === 'detailed' }"
              @click="switchTab('detailed')"
            >Detailed review</button>
            <button
              class="review-tabs__pill"
              :class="{ 'review-tabs__pill--active': activeTab === 'summary' }"
              @click="switchTab('summary')"
            >Quick summary</button>
          </div>
        </div>

        <div v-if="activeTab === 'detailed'" class="review-detailed" key="detailed" @touchstart="onTouchStart" @touchend="onTouchEnd">

          <transition :name="'slide-' + slideDirection" mode="out-in">
            <div class="review-grid" :key="currentPage">
              <div
                v-for="(r, idx) in visibleCards"
                :key="r.questionNumber"
                class="review-card"
                :class="r.isCorrect ? 'review-card--correct' : 'review-card--incorrect'"
              >
                <div class="review-card__top">
                  <span class="review-card__label">
                    Question {{ r.questionNumber }} — {{ r.isCorrect ? 'success' : 'missed' }}
                  </span>
                  <span
                    class="review-card__badge"
                    :class="r.isCorrect ? 'review-card__badge--correct' : 'review-card__badge--incorrect'"
                  >{{ r.isCorrect ? 'Correct' : 'Incorrect' }}</span>
                </div>

                <p class="review-card__question" v-html="r.question"></p>

                <template v-if="r.questionType === 'multiple_choice'">
                  <div class="review-card__answer" :class="r.isCorrect ? 'review-card__answer--correct' : 'review-card__answer--incorrect'">
                    <span class="review-card__answer-icon" :class="r.isCorrect ? 'review-card__answer-icon--correct' : 'review-card__answer-icon--incorrect'">
                      {{ r.isCorrect ? '✓' : '✕' }}
                    </span>
                    <span>{{ r.userAnswer }}</span>
                  </div>
                  <div v-if="!r.isCorrect" class="review-card__answer review-card__answer--correct">
                    <span class="review-card__answer-icon review-card__answer-icon--correct">✓</span>
                    <span>{{ r.correctAnswer }}</span>
                  </div>
                </template>

                <template v-if="r.questionType === 'drag_drop' && r.userAnswers">
                  <div
                    v-for="(match, mIdx) in r.userAnswers"
                    :key="mIdx"
                    class="review-card__answer"
                    :class="r.correctAnswers && r.correctAnswers[mIdx] && match.dropped_in_label === r.correctAnswers[mIdx].correct_drop_zone_label ? 'review-card__answer--correct' : 'review-card__answer--incorrect'"
                  >
                    <span
                      class="review-card__answer-icon"
                      :class="r.correctAnswers && r.correctAnswers[mIdx] && match.dropped_in_label === r.correctAnswers[mIdx].correct_drop_zone_label ? 'review-card__answer-icon--correct' : 'review-card__answer-icon--incorrect'"
                    >{{ r.correctAnswers && r.correctAnswers[mIdx] && match.dropped_in_label === r.correctAnswers[mIdx].correct_drop_zone_label ? '✓' : '✕' }}</span>
                    <span>{{ match.draggable_text }} → {{ match.dropped_in_text }}</span>
                  </div>
                </template>

                <template v-if="r.questionType === 'drag_drop' && !r.userAnswers">
                  <div class="review-card__answer" :class="r.isCorrect ? 'review-card__answer--correct' : 'review-card__answer--incorrect'">
                    <span class="review-card__answer-icon" :class="r.isCorrect ? 'review-card__answer-icon--correct' : 'review-card__answer-icon--incorrect'">
                      {{ r.isCorrect ? '✓' : '✕' }}
                    </span>
                    <span>{{ r.isCorrect ? 'All matches correct' : 'Some matches were wrong' }}</span>
                  </div>
                </template>

                <div class="review-card__explain">
                  {{ getExplanation(r) }}
                </div>
              </div>
            </div>
          </transition>

          <div class="review-dots">
            <button
              v-for="pageIdx in totalPages"
              :key="pageIdx - 1"
              class="review-dot"
              :class="{ 'review-dot--active': (pageIdx - 1) === currentPage }"
              @click="goToPage(pageIdx - 1)"
              :aria-label="'Page ' + pageIdx"
            ></button>
          </div>

        </div>

        <div v-if="activeTab === 'summary'" class="review-summary" key="summary">

          <div class="summary-stats">
            <div class="summary-stat">
              <span class="summary-stat__value summary-stat__value--correct">{{ displayCorrect }}</span>
              <span class="summary-stat__label">Correct</span>
            </div>
            <div class="summary-stat">
              <span class="summary-stat__value summary-stat__value--incorrect">{{ displayIncorrect }}</span>
              <span class="summary-stat__label">Incorrect</span>
            </div>
            <div class="summary-stat">
              <span class="summary-stat__value summary-stat__value--gold">{{ displayAvgTime }}s</span>
              <span class="summary-stat__label">Avg time</span>
            </div>
          </div>

          <div class="summary-chart">
            <div class="summary-chart__header">
              <span class="summary-chart__title">Time per question</span>
              <div class="summary-chart__legend">
                <span class="summary-chart__legend-item">
                  <span class="summary-chart__legend-dot summary-chart__legend-dot--correct"></span>
                  Correct
                </span>
                <span class="summary-chart__legend-item">
                  <span class="summary-chart__legend-dot summary-chart__legend-dot--incorrect"></span>
                  Incorrect
                </span>
              </div>
            </div>

            <div class="summary-chart__area">
              <div class="summary-chart__y">
                <span>{{ maxTime }}s</span>
                <span>{{ Math.round(maxTime * 0.5) }}s</span>
                <span>0s</span>
              </div>
              <div class="summary-chart__grid">
                <span class="summary-chart__gridline"></span>
                <span class="summary-chart__gridline"></span>
                <span class="summary-chart__gridline"></span>
              </div>
              <div class="summary-chart__bars">
                <div
                  v-for="(r, i) in quizResponses"
                  :key="i"
                  class="summary-chart__col"
                >
                  <div
                    class="summary-chart__bar"
                    :class="r.isCorrect ? 'summary-chart__bar--correct' : 'summary-chart__bar--incorrect'"
                    :style="{ height: barHeight(i), transitionDelay: (i * 100) + 'ms' }"
                  ></div>
                  <span class="summary-chart__qlabel">Q{{ i + 1 }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
};
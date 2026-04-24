const ScoreHistory = {
  name: 'ScoreHistory',

  inject: ['store'],

  data() {
    return {
      history: [],
      showPopup: false,
    };
  },

  computed: {
    bestScore() {
      if (!this.history.length) return null;
      return Math.max(...this.history.map(h => h.scoreOutOf10));
    },
    averageScore() {
      if (!this.history.length) return 0;
      const sum = this.history.reduce((acc, h) => acc + h.scoreOutOf10, 0);
      return Math.round(sum / this.history.length);
    },
  },

  created() {
    this.history = this.store.getHistory();
  },

  methods: {
    formatDate(iso) {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    },
    clearHistory() {
      this.store.clearHistory();
      this.history = [];
      this.showPopup = false;
    },
  },

  template: `
    <div v-if="history.length > 0" class="history-trigger">

      <!-- Small icon button -->
      <button class="history-trigger__btn" @click="showPopup = true" aria-label="View quiz history" data-tooltip="Your history">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <span class="history-trigger__count">{{ history.length }}</span>
      </button>

      <!-- Popup overlay -->
      <transition name="modal">
        <div v-if="showPopup" class="settings-overlay" @click.self="showPopup = false">
          <div class="score-history" role="dialog" aria-label="Quiz history">

            <div class="score-history__header">
              <h3 class="score-history__title">Your History</h3>
              <button class="settings-panel__close" @click="showPopup = false" aria-label="Close history">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="score-history__stats">
              <div class="score-history__stat">
                <span class="score-history__stat-value">{{ history.length }}</span>
                <span class="score-history__stat-label">Attempts</span>
              </div>
              <div class="score-history__stat">
                <span class="score-history__stat-value score-history__stat-value--gold">{{ bestScore }}/10</span>
                <span class="score-history__stat-label">Best</span>
              </div>
              <div class="score-history__stat">
                <span class="score-history__stat-value">{{ averageScore }}/10</span>
                <span class="score-history__stat-label">Average</span>
              </div>
            </div>

            <div class="score-history__bars">
              <div
                v-for="(entry, i) in history.slice(-5)"
                :key="i"
                class="score-history__bar-col"
              >
                <div class="score-history__bar-wrap">
                  <div
                    class="score-history__bar"
                    :class="{ 'score-history__bar--best': entry.scoreOutOf10 === bestScore }"
                    :style="{ height: (entry.scoreOutOf10 * 10) + '%' }"
                  ></div>
                </div>
                <span class="score-history__bar-score">{{ entry.scoreOutOf10 }}</span>
                <span class="score-history__bar-date">{{ formatDate(entry.completedAt) }}</span>
              </div>
            </div>

            <div class="score-history__footer">
              <button class="score-history__clear" @click="clearHistory">
                <i class="fa-solid fa-trash-can" style="margin-right: 6px;"></i> Clear History
              </button>
            </div>

          </div>
        </div>
      </transition>
    </div>
  `,
};

const QuizProgress = {
  name: 'QuizProgress',

  props: {
    current: { type: Number, required: true },
    total:   { type: Number, required: true },
  },

  computed: {
    percentage() {
      if (!this.total) return 0;
      return ((this.current) / this.total) * 100;
    },
  },

  template: `
    <div class="progress">
      <div class="progress__inner container">
        <span class="progress__count">{{ current }} / {{ total }}</span>
        <div class="progress__track">
          <div class="progress__fill" :style="{ width: percentage + '%' }"></div>
        </div>
      </div>
    </div>
  `,
};

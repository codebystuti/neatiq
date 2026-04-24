const FeedbackPanel = {
  name: 'FeedbackPanel',

  props: {
    visible:  { type: Boolean, default: false },
    type:     { type: String, default: 'correct' },  // 'correct', 'incorrect', 'poll'
    title:    { type: String, default: '' },
    text:     { type: String, default: '' },
    ctaText:  { type: String, default: 'Next Question' },
    icon:     { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },

  emits: ['next'],

  computed: {
    panelClass() {
      if (this.type === 'incorrect') return 'feedback--incorrect';
      return 'feedback--correct';
    },
    iconSymbol() {
      if (this.icon) return this.icon;
      if (this.type === 'incorrect') return '✕';
      if (this.type === 'poll') return '👍';
      return '✓';
    },
    iconClass() {
      if (this.type === 'incorrect') return 'feedback__icon feedback__icon--wrong';
      return 'feedback__icon feedback__icon--right';
    },
  },

  template: `
    <div
      class="feedback"
      :class="[panelClass, { 'feedback--visible': visible }]"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="feedback__inner container">
        <div class="feedback__body">
          <span :class="iconClass">{{ iconSymbol }}</span>
          <div>
            <p class="feedback__title">{{ title }}</p>
            <p class="feedback__text" v-html="text"></p>
          </div>
        </div>
        <button class="btn btn--primary" @click="$emit('next')" :disabled="disabled">
          {{ ctaText }}
        </button>
      </div>
    </div>
  `,
};

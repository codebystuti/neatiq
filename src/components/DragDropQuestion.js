const DragDropQuestion = {
  name: 'DragDropQuestion',

  props: {
    question:        { type: Object, required: true },
    questionIndex:   { type: Number, required: true },
    instantFeedback: { type: Boolean, default: true },
    isLastQuestion: { type: Boolean, default: false },
  },

  emits: ['answered'],

  data() {
    return {
      draggedElement: null,
      draggedData: null,
      showCorrect: false,
      showIncorrect: false,
      allCorrect: false,
      hasIncorrect: false,
      isProcessingNext: false,
      cardStates: {},       // track correct/incorrect per card
      autoScrollInterval: null,
      scrollSpeed: 0,
      dragTrackHandler: null,
      _lastUserAnswers: null,
      _lastCorrectAnswers: null,
    };
  },

  computed: {
    correctMap() {
      const map = {};
      this.question.drag_options?.forEach((opt, idx) => {
        map[String.fromCharCode(65 + idx)] = opt.target_position;
      });
      return map;
    },
    ctaLabel() {
      if (this.isLastQuestion) return 'See My Results';
      return this.question.drag_submit_cta_text || 'Next Question';
    },
  },

  methods: {
    getLabel(index) {
      return String.fromCharCode(65 + index);
    },

    onDragStart(event, option) {
      event.stopPropagation();
      if (!event.target) return;
      // don't allow re-dragging
      if (event.target.parentElement.classList.contains('dd__card-drop')) {
        event.preventDefault();
        return;
      }
      this.cleanupDragStates();
      this.draggedElement = event.target;
      const index = this.question.drag_options.indexOf(option);
      this.draggedData = { ...option, sourceLabel: String.fromCharCode(65 + index) };
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', this.draggedData.sourceLabel);

      // create drag image so browser wont clone whole item
      const ghost = event.target.cloneNode(true);
      ghost.style.position = 'absolute';
      ghost.style.top = '-9999px';
      ghost.style.width = event.target.offsetWidth + 'px';
      ghost.style.opacity = '0.85';
      document.body.appendChild(ghost);
      event.dataTransfer.setDragImage(ghost, event.target.offsetWidth / 2, 20);
      setTimeout(() => document.body.removeChild(ghost), 0);

      // hide the original
      requestAnimationFrame(() => {
        if (this.draggedElement === event.target) {
          this.draggedElement.classList.add('dd__item--dragging');
        }
      });
      this.startDragTracking();
    },

    onDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!this.draggedElement) {
        event.dataTransfer.dropEffect = 'none';
        return;
      }
      event.dataTransfer.dropEffect = 'move';
      const drop = event.currentTarget;
      if (!drop.querySelector('.dd__item')) {
        drop.classList.add('dd__card-drop--active');
      }
    },

    onDragLeave(event) {
      event.stopPropagation();
      if (event.target === event.currentTarget) {
        event.currentTarget.classList.remove('dd__card-drop--active');
      }
    },

    onDragEnd(event) {
      event.stopPropagation();
      this.stopAutoScroll();
      this.stopDragTracking();
      event.target?.removeAttribute('data-dragging-now');
      if (this.draggedElement && !this.draggedElement.parentElement.classList.contains('dd__card-drop')) {
        this.draggedElement.classList.remove('dd__item--dragging');
        this.draggedElement.style.opacity = '';
      }
      this.$el.querySelectorAll('.dd__card-drop').forEach(s => s.classList.remove('dd__card-drop--active'));
      setTimeout(() => { this.draggedElement = null; this.draggedData = null; }, 50);
    },

    onDrop(event, targetLabel) {
      event.preventDefault();
      event.stopPropagation();
      this.stopAutoScroll();

      const drop = event.currentTarget;
      if (!drop) { this.cleanupDragStates(); return; }
      drop.classList.remove('dd__card-drop--active');

      if (!this.draggedElement || !document.body.contains(this.draggedElement)) {
        this.cleanupDragStates();
        return;
      }

      // cant drop into occupied slot
      if (drop.querySelector('.dd__item')) {
        this.draggedElement.classList.remove('dd__item--dragging');
        this.draggedElement.style.opacity = '';
        this.draggedElement = null;
        this.draggedData = null;
        return;
      }

      const elem = this.draggedElement;
      const dragData = this.draggedData;

      elem.classList.remove('dd__item--dragging');
      elem.style.opacity = '';
      elem.setAttribute('draggable', 'false');
      elem.style.cursor = 'default';

      try { drop.appendChild(elem); }
      catch (e) { this.cleanupDragStates(); return; }

      this.draggedElement = null;
      this.draggedData = null;

      // check correct/incorrect
      const correctTarget = this.correctMap[dragData.sourceLabel];
      elem.classList.remove('dd__item--correct', 'dd__item--incorrect');

      setTimeout(() => {
        const placed = drop.querySelector('.dd__item');
        if (!placed) return;
        const card = drop.closest('.dd__card');
        if (correctTarget === targetLabel) {
          placed.classList.add('dd__item--correct');
          if (card) card.classList.add('dd__card--correct');
          this.$set_cardState(targetLabel, 'correct');
        } else {
          placed.classList.add('dd__item--incorrect');
          if (card) card.classList.add('dd__card--incorrect');
          this.$set_cardState(targetLabel, 'incorrect');
        }
        this.checkAllPlaced();
      }, 100);
    },

    $set_cardState(label, state) {
      this.cardStates = { ...this.cardStates, [label]: state };
    },

    checkAllPlaced() {
      const section = this.$el;
      if (!section) return;
      const items = section.querySelectorAll('.dd__item');
      const drops = section.querySelectorAll('.dd__card-drop');
      const allPlaced = Array.from(drops).every(d => d.querySelector('.dd__item'));
      if (!allPlaced) return;

      let allCorrect = true;
      let hasIncorrect = false;
      const userAnswers = [];
      const correctAnswers = [];

      items.forEach(item => {
        const dragLabel = item.getAttribute('data-position');
        const parentDrop = item.closest('.dd__card-drop');
        if (!parentDrop) return;
        const dropLabel = parentDrop.getAttribute('data-placeholder');
        const dragText = item.querySelector('.dd__item-text')?.textContent.trim() || '';
        const card = parentDrop.closest('.dd__card');
        const dropText = card?.querySelector('.dd__card-label')?.textContent.trim() || '';
        const correctLbl = this.correctMap[dragLabel];
        const correctCard = section.querySelector('.dd__card-drop[data-placeholder="' + correctLbl + '"]')?.closest('.dd__card');
        const correctTxt = correctCard?.querySelector('.dd__card-label')?.textContent.trim() || '';

        userAnswers.push({ draggable_label: dragLabel, draggable_text: dragText, dropped_in_label: dropLabel, dropped_in_text: dropText });
        correctAnswers.push({ draggable_label: dragLabel, draggable_text: dragText, correct_drop_zone_label: correctLbl, correct_drop_zone_text: correctTxt });

        if (item.classList.contains('dd__item--incorrect')) { hasIncorrect = true; allCorrect = false; }
        else if (!item.classList.contains('dd__item--correct')) allCorrect = false;
      });

      this.allCorrect = allCorrect;
      this.hasIncorrect = hasIncorrect;
      this._lastUserAnswers = userAnswers;
      this._lastCorrectAnswers = correctAnswers;

      setTimeout(() => {
        if (this.instantFeedback) {
          if (allCorrect) this.showCorrect = true;
          else if (hasIncorrect) this.showIncorrect = true;
        } else {
          setTimeout(() => {
            this.emitAnswer(allCorrect, userAnswers, correctAnswers);
          }, 800);
        }
      }, 600);
    },

    emitAnswer(isCorrect, userAnswers, correctAnswers) {
      this.$emit('answered', {
        questionIndex: this.questionIndex,
        questionType: 'drag_drop',
        question: this.question.dragQuestion,
        userAnswers: userAnswers || this._lastUserAnswers,
        correctAnswers: correctAnswers || this._lastCorrectAnswers,
        isCorrect,
      });
    },

    nextQuestion() {
      if (this.isProcessingNext) return;
      this.isProcessingNext = true;

      this.showCorrect = false;
      this.showIncorrect = false;

      setTimeout(() => {
        this.emitAnswer(this.allCorrect);
        this.isProcessingNext = false;
      }, 900);
    },

    cleanupDragStates() {
      this.stopAutoScroll();
      this.stopDragTracking();
      this.$el?.querySelectorAll('.dd__item').forEach(el => {
        el.removeAttribute('data-dragging-now');
        el.classList.remove('dd__item--dragging');
        if (!el.parentElement.classList.contains('dd__card-drop')) el.style.opacity = '';
      });
      this.$el?.querySelectorAll('.dd__card-drop').forEach(s => s.classList.remove('dd__card-drop--active'));
      this.draggedElement = null;
      this.draggedData = null;
    },

    startAutoScroll(clientY) {
      if (this.autoScrollInterval) { clearInterval(this.autoScrollInterval); this.autoScrollInterval = null; }
      const threshold = 200;
      const maxSpeed = 12;
      const vh = window.innerHeight;
      if (clientY < threshold) this.scrollSpeed = -Math.min(maxSpeed, ((threshold - clientY) / threshold) * maxSpeed);
      else if (clientY > vh - threshold) this.scrollSpeed = Math.min(maxSpeed, ((clientY - (vh - threshold)) / threshold) * maxSpeed);
      else this.scrollSpeed = 0;
      if (this.scrollSpeed !== 0) {
        this.autoScrollInterval = setInterval(() => window.scrollBy(0, this.scrollSpeed), 16);
      }
    },

    stopAutoScroll() {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
      this.scrollSpeed = 0;
    },

    startDragTracking() {
      this.dragTrackHandler = (e) => {
        if (!this.draggedElement) return;
        const y = e.clientY ?? e.touches?.[0]?.clientY;
        if (y != null) this.startAutoScroll(y);
      };
      document.addEventListener('drag', this.dragTrackHandler);
      document.addEventListener('touchmove', this.dragTrackHandler, { passive: false });
    },

    stopDragTracking() {
      if (!this.dragTrackHandler) return;
      document.removeEventListener('drag', this.dragTrackHandler);
      document.removeEventListener('touchmove', this.dragTrackHandler);
      this.dragTrackHandler = null;
    },
  },

  mounted() {
    // cleanup
    document.addEventListener('dragover', () => {
      if (!this.draggedElement) {
        this.$el?.querySelectorAll('.dd__item').forEach(el => {
          if (!el.parentElement.classList.contains('dd__card-drop')) {
            el.style.opacity = '';
            el.classList.remove('dd__item--dragging');
          }
        });
      }
    });
  },

  beforeUnmount() {
    this.stopAutoScroll();
    this.stopDragTracking();
  },

  template: `
    <section class="dd" :data-q="questionIndex" :aria-label="'Question ' + (questionIndex + 1)">
      <div class="dd__inner container">
        <h2 class="dd__question">{{ question.dragQuestion }}</h2>
        <p v-if="question.drag_intro_text" class="dd__intro">{{ question.drag_intro_text }}</p>

        <!-- Unified cards: label on top, drop zone on bottom -->
        <div class="dd__cards" :class="'dd__cards--' + question.drop_zones.length">
          <div
            v-for="zone in question.drop_zones"
            :key="'card-' + zone.label"
            class="dd__card"
            :class="{
              'dd__card--correct': cardStates[zone.label] === 'correct',
              'dd__card--incorrect': cardStates[zone.label] === 'incorrect'
            }"
          >
            <p class="dd__card-label">{{ zone.description }}</p>
            <div
              class="dd__card-drop"
              :class="{
                'dd__card-drop--empty': !cardStates[zone.label],
                'dd__card-drop--filled': !!cardStates[zone.label]
              }"
              :data-placeholder="zone.label"
              @dragover.prevent="onDragOver($event)"
              @dragenter.prevent
              @dragleave="onDragLeave($event)"
              @drop="onDrop($event, zone.label)"
            ></div>
          </div>
        </div>

        <!-- Draggable items -->
        <div class="dd__items" :class="'dd__items--' + question.drag_options.length">
          <div
            v-for="(option, index) in question.drag_options"
            :key="'item-' + index"
            class="dd__item"
            draggable="true"
            role="button"
            tabindex="0"
            :aria-label="'Drag: ' + option.drag_item_title"
            :data-position="getLabel(index)"
            @dragstart="onDragStart($event, option)"
            @dragend="onDragEnd($event)"
          >
            <span v-if="option.show_sequence" class="dd__item-letter">{{ getLabel(index) }})</span>
            <span class="dd__item-text">{{ option.drag_item_title }}</span>
          </div>
        </div>
      </div>

      <feedback-panel
        :visible="showIncorrect"
        type="incorrect"
        :title="question.drag_incorrect_answer_title"
        :text="question.drag_incorrect_answer_text"
        :cta-text="ctaLabel"
        :disabled="isProcessingNext"
        @next="nextQuestion"
      />

      <feedback-panel
        :visible="showCorrect"
        type="correct"
        :title="question.drag_correct_answer_title"
        :text="question.drag_correct_answer_text"
        :cta-text="ctaLabel"
        :disabled="isProcessingNext"
        @next="nextQuestion"
      />
    </section>
  `,
};
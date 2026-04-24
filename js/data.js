const QUIZ_DATA = {
  landing_page: {
    title: "Know Before You Pour",
    intro_text: "Think you know your limits? Test your knowledge about alcohol, its effects on the body, and how to make smarter choices.",
    content: "<p>This short quiz covers everything from standard drink sizes to how alcohol affects your health. Answer 10 questions and find out where you stand.</p>",
    notes: "<p>This quiz is for educational purposes only. Always drink responsibly and follow your local guidelines.</p>",
    link_text: "Start the Quiz",
    image: {
      url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      alt: "Various drinks on a table"
    },
    number_of_questions: "10"
  },

  questions: [
    {
      question_type: "multiple_choice",
      questionId: "q1",
      question: "How many units of alcohol are in a standard glass of wine (175ml, 13% ABV)?",
      is_featured_question: true,
      background_image: {
        url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80",
        alt: "Glass of wine"
      },
      options: [
        { option: "1.5 units", is_true: false },
        { option: "2.3 units", is_true: true },
        { option: "3.0 units", is_true: false },
        { option: "0.8 units", is_true: false }
      ],
      incorrect_answer_title: "Not quite!",
      incorrect_answer_text: "A 175ml glass of wine at 13% ABV contains approximately 2.3 units of alcohol. Always check the label to know what you're drinking.",
      correct_answer_title: "Correct!",
      correct_answer_text: "A standard 175ml pour at 13% ABV is 2.3 units. Keeping track helps you stay within recommended guidelines.",
      submit_cta_text: "Next Question"
    },
    {
      question_type: "multiple_choice",
      questionId: "q2",
      question: "What is the recommended maximum weekly alcohol intake for adults according to most health guidelines?",
      is_featured_question: true,
      background_image: { url: "", alt: "" },
      options: [
        { option: "10 units", is_true: false },
        { option: "21 units", is_true: false },
        { option: "14 units", is_true: true },
        { option: "28 units", is_true: false }
      ],
      incorrect_answer_title: "Not quite right.",
      incorrect_answer_text: "Most health authorities recommend no more than 14 units per week — spread across at least 3 days.",
      correct_answer_title: "Well done!",
      correct_answer_text: "14 units per week is the recommended limit. That's roughly 6 medium glasses of wine or 6 pints of average-strength beer.",
      submit_cta_text: "Next Question"
    },
    {
      question_type: "multiple_choice",
      questionId: "q3",
      question: "Which organ is primarily responsible for breaking down alcohol in the body?",
      is_featured_question: false,
      background_image: {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80",
        alt: "Human body illustration"
      },
      options: [
        { option: "Kidneys",  is_true: false },
        { option: "Stomach",  is_true: false },
        { option: "Liver",    is_true: true  },
        { option: "Pancreas", is_true: false }
      ],
      incorrect_answer_title: "Not quite!",
      incorrect_answer_text: "The liver is your body's main alcohol processing organ. It can only process about one unit per hour.",
      correct_answer_title: "Correct!",
      correct_answer_text: "The liver processes alcohol at a fixed rate of roughly one unit per hour. Food slows absorption but doesn't speed up processing.",
      submit_cta_text: "Next Question"
    },
    {
      question_type: "drag_drop",
      dragQuestionId: "q4",
      dragQuestion: "Match each drink to its approximate unit count",
      is_featured_question: false,
      drag_intro_text: "Drag each drink to the correct unit count box.",
      drop_zones: [
        { label: "A", description: "2.3 units"  },
        { label: "B", description: "1 unit"     },
        { label: "C", description: "3 units"    },
        { label: "D", description: "1.7 units"  }
      ],
      drag_options: [
        { drag_item_title: "Large wine (250ml, 12%)",      show_sequence: true, target_position: "C" },
        { drag_item_title: "Bottle of beer (330ml, 5%)",   show_sequence: true, target_position: "D" },
        { drag_item_title: "Pint of beer (4% ABV)",        show_sequence: true, target_position: "A" },
        { drag_item_title: "Single shot of spirits (40%)", show_sequence: true, target_position: "B" }
      ],
      drag_incorrect_answer_title: "Some matches were off.",
      drag_incorrect_answer_text: "Pint 4% ≈ 2.3 units · Shot 40% ≈ 1 unit · 250ml wine 12% ≈ 3 units · 330ml beer 5% ≈ 1.7 units.",
      drag_correct_answer_title: "Perfect match!",
      drag_correct_answer_text: "You nailed it! Knowing unit counts helps you track your weekly intake accurately.",
      drag_submit_cta_text: "Next Question"
    },
    {
      question_type: "multiple_choice",
      questionId: "q5",
      question: "How does alcohol affect sleep quality?",
      is_featured_question: false,
      background_image: { url: "", alt: "" },
      options: [
        { option: "It improves deep sleep throughout the night",        is_true: false },
        { option: "It has no effect on sleep quality",                  is_true: false },
        { option: "It disrupts REM sleep and reduces overall quality",  is_true: true  },
        { option: "It only affects sleep if consumed after midnight",   is_true: false }
      ],
      incorrect_answer_title: "That's a common myth!",
      incorrect_answer_text: "While alcohol may help you fall asleep faster, it disrupts REM sleep — leaving you tired the next morning.",
      correct_answer_title: "Spot on!",
      correct_answer_text: "Alcohol suppresses REM sleep. You might drift off quickly, but your sleep is fragmented and less restorative.",
      submit_cta_text: "Next Question"
    },
    {
      question_type: "multiple_choice",
      questionId: "q6",
      question: "What percentage of alcohol is absorbed directly through the stomach?",
      is_featured_question: false,
      background_image: {
        url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=700&q=80",
        alt: "Medical illustration"
      },
      options: [
        { option: "5%",  is_true: false },
        { option: "20%", is_true: true  },
        { option: "50%", is_true: false },
        { option: "80%", is_true: false }
      ],
      incorrect_answer_title: "Close, but not quite.",
      incorrect_answer_text: "About 20% of alcohol is absorbed through the stomach wall. The remaining 80% is absorbed through the small intestine.",
      correct_answer_title: "Correct!",
      correct_answer_text: "20% in the stomach, 80% in the small intestine. Eating before drinking slows absorption significantly.",
      submit_cta_text: "Next Question"
    },
    {
      question_type: "multiple_choice",
      questionId: "q7",
      question: "Which of the following is a sign of alcohol dependence?",
      is_featured_question: false,
      background_image: { url: "", alt: "" },
      options: [
        { option: "Drinking one glass of wine with dinner",       is_true: false },
        { option: "Feeling you need alcohol to feel 'normal'",    is_true: true  },
        { option: "Enjoying alcohol at social events",            is_true: false },
        { option: "Choosing not to drink at work events",         is_true: false }
      ],
      incorrect_answer_title: "Not quite.",
      incorrect_answer_text: "Dependence involves needing alcohol to function or feel normal — including cravings, withdrawal symptoms, and increasing tolerance.",
      correct_answer_title: "Correct!",
      correct_answer_text: "Needing alcohol to feel 'normal' is a core sign of dependence. Speaking to a GP or counsellor is an important first step.",
      submit_cta_text: "Next Question"
    },
    {
      question_type: "drag_drop",
      dragQuestionId: "q8",
      dragQuestion: "Order these from lowest to highest alcohol by volume (ABV)",
      is_featured_question: false,
      drag_intro_text: "Drag each drink to the right position — from weakest to strongest.",
      drop_zones: [
        { label: "A", description: "Weakest"   },
        { label: "B", description: "Second"    },
        { label: "C", description: "Third"     },
        { label: "D", description: "Strongest" }
      ],
      drag_options: [
        { drag_item_title: "Whisky (40% ABV)",        show_sequence: true, target_position: "D" },
        { drag_item_title: "Lager (4.5% ABV)",        show_sequence: true, target_position: "A" },
        { drag_item_title: "Fortified Wine (18% ABV)",show_sequence: true, target_position: "C" },
        { drag_item_title: "Table Wine (12% ABV)",    show_sequence: true, target_position: "B" }
      ],
      drag_incorrect_answer_title: "Not the right order.",
      drag_incorrect_answer_text: "Weakest to strongest: Lager (4.5%) → Table Wine (12%) → Fortified Wine (18%) → Whisky (40%).",
      drag_correct_answer_title: "Excellent!",
      drag_correct_answer_text: "You got them in the right order. Knowing a drink's ABV helps you calculate units accurately.",
      drag_submit_cta_text: "Next Question"
    },
    {
      question_type: "multiple_choice",
      questionId: "q9",
      question: "Is it safe to drink alcohol during pregnancy?",
      is_featured_question: true,
      background_image: { url: "", alt: "" },
      options: [
        { option: "Only one glass of wine per week is fine",           is_true: false },
        { option: "A small beer occasionally has no risk",             is_true: false },
        { option: "No amount of alcohol is considered safe",           is_true: true  },
        { option: "Alcohol is only harmful in the third trimester",    is_true: false }
      ],
      incorrect_answer_title: "This is a crucial one.",
      incorrect_answer_text: "No amount of alcohol has been proven safe during pregnancy. It crosses the placenta and can affect foetal development at any stage.",
      correct_answer_title: "Absolutely right!",
      correct_answer_text: "No alcohol is safe during pregnancy. Foetal Alcohol Spectrum Disorders (FASDs) are entirely preventable.",
      submit_cta_text: "Next Question"
    },
    {
      question_type: "multiple_choice",
      questionId: "q10",
      question: "Which of the following strategies helps you drink less without feeling left out?",
      is_featured_question: false,
      background_image: {
        url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&q=80",
        alt: "Friends socialising"
      },
      options: [
        { option: "Avoid all social situations with alcohol",               is_true: false },
        { option: "Alternate alcoholic drinks with water or soft drinks",   is_true: true  },
        { option: "Only drink at home where no one can see you",            is_true: false },
        { option: "Drink quickly so you appear the same as others",         is_true: false }
      ],
      incorrect_answer_title: "There's a better way!",
      incorrect_answer_text: "Avoiding social situations isn't sustainable. Alternating drinks, choosing low-alcohol options, and pacing yourself are practical strategies.",
      correct_answer_title: "Great strategy!",
      correct_answer_text: "Alternating drinks is one of the most effective techniques — it halves your intake and keeps you hydrated naturally.",
      submit_cta_text: "See My Results"
    }
  ],

  poll_questions: [
    {
      question_type: "poll",
      questionId: "poll1",
      title: "Before You See Your Score",
      question: "How did you find the quiz?",
      intro_text: "Your honest feedback helps us make the quiz better for everyone.",
      background_image: {
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=80",
        alt: "Person writing feedback"
      },
      options: [
        { option: "Loved it — learnt something new",       optionEN: "Loved it"         },
        { option: "Enjoyed it but found it tricky",        optionEN: "Found it tricky"  },
        { option: "Some questions felt too easy",          optionEN: "Too easy"         },
        { option: "Not what I expected",                   optionEN: "Not expected"     }
      ],
      feedback_title: "Thanks for the feedback!",
      feedback_text: "We're always improving. Now let's see how you did on the quiz — your results are ready.",
      submit_cta_text: "See My Results"
    }
  ],

  results_page: {
    banner_tag_title: "Your Score",
    articles_title: "Recommended Reading For You",

    beginner: {
      title: "Room to Grow",
      content: "You're just starting your alcohol awareness journey. The most important information is easy to learn and can make a big difference to your health.",
      min_score: 0, max_score: 3
    },
    beginner_articles: [
      {
        title: "What Is a Unit of Alcohol?",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=800&q=80",
        image_alt: "Measuring alcohol units",
        category: "Alcohol", read_time: "3"
      },
      {
        title: "Understanding the Weekly Guidelines",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
        image_alt: "Health guidelines",
        category: "Body", read_time: "4"
      },
      {
        title: "The Basics of Alcohol and Your Body",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
        image_alt: "Body and health",
        category: "Mind", read_time: "5"
      }
    ],

    moderate: {
      title: "Getting There",
      content: "You have a solid foundation. A few more facts could help you make even smarter decisions for yourself and those around you.",
      min_score: 4, max_score: 6
    },
    moderate_articles: [
      {
        title: "How Alcohol Affects Your Sleep",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80",
        image_alt: "Person sleeping",
        category: "Mind", read_time: "4"
      },
      {
        title: "Drinking Less Without Missing Out",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
        image_alt: "Friends at a social event",
        category: "Relationships", read_time: "5"
      },
      {
        title: "Alcohol and Your Mental Health",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        image_alt: "Mental wellbeing",
        category: "Mind", read_time: "6"
      }
    ],

    high: {
      title: "Well Informed",
      content: "You're clearly clued up. Your knowledge puts you in a great position to make informed choices and support others around you.",
      min_score: 7, max_score: 9
    },
    high_articles: [
      {
        title: "Long-Term Effects of Alcohol on the Liver",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
        image_alt: "Medical research",
        category: "Body", read_time: "7"
      },
      {
        title: "Recognising the Signs of Dependence",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
        image_alt: "Person reflecting",
        category: "Mind", read_time: "5"
      },
      {
        title: "How to Support Someone Who Drinks Too Much",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
        image_alt: "People supporting each other",
        category: "Relationships", read_time: "6"
      }
    ],

    extreme: {
      title: "Expert Level!",
      content: "Outstanding! A perfect score shows exceptional knowledge about alcohol and its effects. You're well-equipped to make the best decisions.",
      image_url: "", image_alt: "Perfect score",
      min_score: 10, max_score: 10
    },
    extreme_articles: [
      {
        title: "The Science Behind Alcohol Metabolism",
        url: "#",
        image_url: "https://picsum.photos/seed/science10/600/400",
        image_alt: "Science lab",
        category: "Body", read_time: "8"
      },
      {
        title: "Alcohol Policy: What the Research Says",
        url: "#",
        image_url: "https://picsum.photos/seed/research11/600/400",
        image_alt: "Research documents",
        category: "Alcohol", read_time: "9"
      },
      {
        title: "Foetal Alcohol Spectrum Disorders Explained",
        url: "#",
        image_url: "https://picsum.photos/seed/health12/600/400",
        image_alt: "Healthcare information",
        category: "Body", read_time: "7"
      }
    ],

    bottom_cards: {
      title: "Keep Learning",
      first_card: {
        title: "Explore Our Articles",
        content: "Dive deeper into topics like the effects of alcohol on mental health, relationships, and long-term wellbeing.",
        link_text: "Browse Articles",
        link_url: "#"
      },
      second_card: {
        title: "Share Your Score",
        content: "Challenge your friends and family to take the quiz and compare results. Knowledge is best shared."
      }
    }
  }
};
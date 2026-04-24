const routes = [
  { path: '/',        name: 'landing', component: QuizLanding  },
  { path: '/quiz',    name: 'quiz',    component: QuizPlay     },
  { path: '/results', name: 'results', component: QuizResults  },
  // catch-all: any unknown path redirects to landing
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

/*
  If someone types the URL directly, they get redirected to landing.
*/
router.beforeEach((to, from) => {
  if (to.name === 'results' && !quizStore.quizCompleted) {
    return { name: 'landing' };
  }

  if (to.name === 'quiz' && !quizStore.quizStarted) {
    return { name: 'landing' };
  }

  return true;
});

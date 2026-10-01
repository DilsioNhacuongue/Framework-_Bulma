document.addEventListener('DOMContentLoaded', () => {
  // Menu hamburguer do Bulma
  document.querySelectorAll('.navbar-burger').forEach(burger => {
    burger.addEventListener('click', () => {
      const target = document.getElementById(burger.dataset.target);
      const active = burger.classList.toggle('is-active');
      target?.classList.toggle('is-active', active);
      burger.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
  });

  // Fecha o menu depois de escolher um link no telemóvel.
  document.querySelectorAll('.navbar-menu .navbar-item').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.navbar-burger').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-expanded','false');
      });
      document.querySelectorAll('.navbar-menu').forEach(m => m.classList.remove('is-active'));
    });
  });

  // Ano automático no rodapé.
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Animação de entrada dos elementos ao aparecerem no ecrã.
  const revealItems = document.querySelectorAll('.reveal-on-scroll, .team-card, .stat-block, .project-callout');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    revealItems.forEach(el => observer.observe(el));
  }

  // Formulário de contacto do líder: prepara uma mensagem no programa de email do visitante.
  const form = document.getElementById('leaderContactForm');
  if(form){
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const message = document.getElementById('message').value.trim();
      const status = document.getElementById('formStatus');
      const subject = encodeURIComponent(`Mensagem pelo portfólio StackFive — ${name}`);
      const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
      window.location.href = `mailto:dilsioernestonhacuongue07@gmail.com?subject=${subject}&body=${body}`;
      status.textContent = 'A abrir a aplicação de email com a mensagem preparada...';
    });
  }
});

'use strict';
// This password is a theatrical entrance, not server-side security.
const ACCESS_CODE = 'SHINE';
const gate = document.querySelector('#gate');
const desktop = document.querySelector('#desktop');
const form = document.querySelector('#login');
const password = document.querySelector('#password');
const feedback = document.querySelector('#feedback');
const soundButton = document.querySelector('#sound');
const panel = document.querySelector('#panel-body');
let soundEnabled = true;
let audio;
let entering = false;
let entryTimer;
function tone(frequency, duration, type = 'square', volume = 0.025, delay = 0) {
  if (!soundEnabled) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  try {
    audio ||= new Audio();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    const start = audio.currentTime + delay;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency * 0.3), start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(start); oscillator.stop(start + duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  } catch { /* Audio is optional; navigation remains available. */ }
}
function keySound() { tone(450 + Math.random() * 450, .035, 'triangle', .07); tone(120, .022, 'square', .018); }
function stopSpeech() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
function speak() {
  if (!soundEnabled || !('speechSynthesis' in window)) return;
  stopSpeech();
  const message = new SpeechSynthesisUtterance('Connexion établie. Bienvenue dans le système Make It Shine.');
  message.lang = 'fr-FR'; message.rate = .86; message.pitch = .65; message.volume = .65;
  window.speechSynthesis.speak(message);
}
soundButton.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundButton.textContent = soundEnabled ? 'SON : ON ◖))' : 'SON : OFF ⊘';
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
  if (!soundEnabled) { stopSpeech(); if (audio) audio.suspend().catch(() => {}); }
});
password.addEventListener('input', keySound);
password.addEventListener('keydown', event => { if (['ArrowLeft','ArrowRight','Enter'].includes(event.key)) keySound(); });
document.addEventListener('click', event => { if (event.target.closest('button,a') && !event.target.closest('#sound')) tone(1100,.045,'square',.025); });
const screens = {
  signal: { title: 'SIGNAL.EXE', html: '<span class="file-tag">TRANSMISSION 001 / À TOUS CEUX QUI ÉCOUTENT</span><h3>TURN THE NOISE<br>INTO LIGHT.</h3><p>Nous sommes Make It Shine. Une même étincelle, une envie de faire vibrer les murs. Ici, on monte le son et on laisse la musique parler.</p><p class="note">SIGNAL REÇU. VOUS FAITES DÉSORMAIS PARTIE DE LA FRÉQUENCE.</p>' },
  music: { title: 'MUSIC.WAV', html: '<span class="file-tag">ARCHIVES SONORES</span><h3>LE SON<br>PREND FORME.</h3><p>Les morceaux de Make It Shine seront disponibles ici. La transmission musicale n’est pas encore ouverte.</p><p class="note">STATUT : EN ATTENTE DES PREMIERS FICHIERS AUDIO.</p>' },
  live: { title: 'LIVE.SYS', html: '<span class="file-tag">RENDEZ-VOUS DEVANT LA SCÈNE</span><h3>SEE YOU<br>IN THE CROWD.</h3><p>Du premier accord au dernier rappel. Retrouvez bientôt ici les prochaines dates de Make It Shine.</p><p class="note">AUCUN CONCERT ANNONCÉ POUR LE MOMENT.</p>' },
  contact: { title: 'CONTACT.TXT', html: '<span class="file-tag">OUVRIR UNE NOUVELLE TRANSMISSION</span><h3>LET’S MAKE<br>IT HAPPEN.</h3><p>Une scène, une collaboration, une idée ? Les coordonnées de Make It Shine seront ajoutées ici prochainement.</p><p class="note">CANAL DE CONTACT : PAS ENCORE CONFIGURÉ.</p>' }
};
function openPanel(name, focus = true) {
  const screen = screens[name]; if (!screen) return;
  document.querySelector('#panel-title').textContent = screen.title;
  panel.innerHTML = screen.html; panel.hidden = false;
  document.querySelector('#minimize').setAttribute('aria-expanded', 'true');
  document.querySelector('#minimize').textContent = '−';
  document.querySelectorAll('[data-panel]').forEach(button => button.setAttribute('aria-current', String(button.dataset.panel === name)));
  if (focus) panel.focus();
}
document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
document.querySelector('#minimize').addEventListener('click', event => {
  panel.hidden = !panel.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!panel.hidden));
  event.currentTarget.textContent = panel.hidden ? '+' : '−';
});
form.addEventListener('submit', event => {
  event.preventDefault(); if (entering) return;
  if (password.value.trim().toUpperCase() !== ACCESS_CODE) {
    feedback.classList.add('error'); feedback.textContent = 'ACCÈS REFUSÉ. ESSAYEZ ENCORE.';
    tone(130,.25,'sawtooth',.03);
    document.querySelector('.terminal').classList.remove('shake');
    void gate.offsetWidth;
    document.querySelector('.terminal').classList.add('shake');
    password.select(); return;
  }
  entering = true; password.disabled = true;
  feedback.classList.remove('error'); feedback.textContent = 'ACCÈS AUTORISÉ. OUVERTURE DU SIGNAL…';
  [440,660,880].forEach((f,i) => tone(f,.18,'sine',.07,i * .12));
  speak();
  entryTimer = setTimeout(() => {
    gate.hidden = true; desktop.hidden = false; openPanel('signal');
    entering = false; password.disabled = false; password.value = '';
  }, 1000);
});
function lock() {
  clearTimeout(entryTimer); entering = false; stopSpeech(); desktop.hidden = true; gate.hidden = false;
  password.disabled = false; password.value = ''; feedback.classList.remove('error');
  feedback.textContent = 'EN ATTENTE D’IDENTIFICATION_'; password.focus();
}
document.querySelector('#lock').addEventListener('click', lock);
document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); lock(); });
function clock() { document.querySelector('#clock').textContent = new Date().toLocaleTimeString('fr-FR'); }
clock(); setInterval(clock,1000);
document.querySelector('#year').textContent = new Date().getFullYear();

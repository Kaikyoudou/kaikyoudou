// Simple JS: mobile menu toggle
document.addEventListener('DOMContentLoaded',function(){
  var btn = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click',function(){
    if(nav.style.display === 'block'){
      nav.style.display = '';
    } else {
      nav.style.display = 'block';
    }
  });
});

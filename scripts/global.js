function indexLoad(){
    window.open("index.html", '_self');
}

function goToTwitterPage(){
    window.open('https://x.com/jack?lang=en/', '_blank').focus();
}

function goToInstagramPage(){
    window.open('https://www.instagram.com/zuck/', '_blank').focus();
}

function toggleNav(){
    const navs = document.getElementById('navs');
    const isMenuOpen = navs.classList.contains('active');

    if (isMenuOpen) {
        navs.classList.remove('active');
        document.body.style.overflow = 'auto';
    } else {
        navs.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('resize', function() {
        const navs = document.getElementById('navs');
        if (window.innerWidth > 1160) {
            navs.style.display = 'flex';
            navs.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            if (!navs.classList.contains('active')) {
                navs.style.display = 'none';
            }
        }
    });


    //navs itemlerine tıklandığında menünün kapatılması
    const navBarItems = document.querySelectorAll('#navs a');
    navBarItems.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1160) {
                const navs = document.getElementById('navs');
                navs.classList.remove('active');
                document.body.style.overflow = 'auto';
                navs.style.display = 'none';
            }
        });
    });
});
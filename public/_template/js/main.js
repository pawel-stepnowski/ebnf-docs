window.addEventListener('load', onWindowLoad);

async function onWindowLoad()
{
    initializeNavigation();
}

function initializeNavigation()
{
    document.querySelectorAll('aside .buttons .menu').forEach(element => element.addEventListener('click', () =>
    {
        document.querySelectorAll('aside').forEach(element => element.classList.toggle('collapsed'))
    }));
    const sections = document.querySelectorAll('section');
    const config = { rootMargin: '-50px 0px -55%' };
    const intersection_observer_callback = (/** @type {IntersectionObserverEntry[]} */ entries) =>
        {
            entries.forEach(entry =>
            {
                if (entry.isIntersecting)
                {
                    const id = entry.target.id;
                    if (id)
                    { 
                        const current_active_item = document.querySelector('nav .active');
                        const intersecting_item = document.querySelector('nav a[href="#' + id + '"]');
                        if (current_active_item) current_active_item.classList.remove('active');
                        if (intersecting_item) intersecting_item.classList.add('active');
                    }
                }
            });
        }
    const observer = new IntersectionObserver(intersection_observer_callback, config);
    sections.forEach(section => observer.observe(section));
}
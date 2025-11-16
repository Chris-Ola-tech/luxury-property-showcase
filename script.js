const mobileToggle = document.getElementById('mobileToggle');
        const navMain = document.querySelector('.nav-main');
        const header = document.querySelector('.luxury-header');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileToggle.classList.toggle('active');
            navMain.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 968) {
                    mobileToggle.classList.remove('active');
                    navMain.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
        
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 968) {
                mobileToggle.classList.remove('active');
                navMain.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });




function animateCount(element, target, suffix, duration = 2000) {
            let startTime = null;
            const startValue = 0;
            
            function animation(currentTime) {
                if (!startTime) startTime = currentTime;
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(easeOutQuart * target);
                
                element.textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    element.textContent = target + suffix;
                }
            }
            
            requestAnimationFrame(animation);
        }
        
        // Intersection Observer to detect when section enters viewport
        const observerOptions = {
            threshold: 0.5, // Trigger when 50% of the section is visible
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    // Mark as animated to prevent retriggering
                    entry.target.classList.add('animated');
                    
                    // Find all stat numbers and animate them
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        const suffix = stat.getAttribute('data-suffix');
                        animateCount(stat, target, suffix);
                    });
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Start observing the stats section
        const statsSection = document.querySelector('.parallax-stats');
        observer.observe(statsSection);




document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('propertySearchForm');
    const quickFilterButtons = document.querySelectorAll('.quick-filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');
    const propertyCount = document.getElementById('propertyCount');
    const noResults = document.getElementById('noResults');
    
    // Modal elements
    const propertyModal = document.getElementById('propertyModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalLocation = document.getElementById('modalLocation');
    const modalPrice = document.getElementById('modalPrice');
    const modalBadge = document.getElementById('modalBadge');
    const propertyDetailsButtons = document.querySelectorAll('.property-details-btn');
    
    // Modal functionality
    propertyDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.property-card');
            const image = card.querySelector('.property-image img').src;
            const title = card.querySelector('.property-title').textContent;
            const locationText = card.querySelector('.property-location').textContent.trim();
            const price = card.querySelector('.property-price').textContent;
            const badge = card.querySelector('.property-badge').textContent;
            
            modalImage.src = image;
            modalImage.alt = title;
            modalTitle.textContent = title;
            modalLocation.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${locationText}`;
            modalPrice.textContent = price;
            modalBadge.textContent = badge;
            
            openModal();
        });
    });
    
    function openModal() {
        propertyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        propertyModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && propertyModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Main search form handler
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const propertyType = document.getElementById('propertyType').value;
        const location = document.getElementById('location').value;
        const budget = document.getElementById('budget').value;
        
        filterProperties(propertyType, location, budget);
        quickFilterButtons.forEach(btn => btn.classList.remove('active'));
    });
    
    // Quick filter buttons
    quickFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            quickFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            applyQuickFilter(filterType);
        });
    });
    
    // Filter function
    function filterProperties(type, location, budget) {
        let visibleCount = 0;
        
        propertyCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardLocation = card.getAttribute('data-location');
            const cardPrice = parseFloat(card.getAttribute('data-price'));
            
            let matchesType = !type || type === '' || cardType === type;
            let matchesLocation = !location || location === '' || cardLocation === location;
            let matchesBudget = true;
            
            if (budget && budget !== '') {
                if (budget === '10000000+') {
                    matchesBudget = cardPrice >= 10000000;
                } else {
                    const [min, max] = budget.split('-').map(Number);
                    matchesBudget = cardPrice >= min && cardPrice <= max;
                }
            }
            
            if (matchesType && matchesLocation && matchesBudget) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        updateResultsDisplay(visibleCount);
    }
    
    // Quick filter
    function applyQuickFilter(filterType) {
        let visibleCount = 0;
        
        propertyCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (cardCategory === filterType) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        updateResultsDisplay(visibleCount);
    }
    
    // Update display
    function updateResultsDisplay(count) {
        propertyCount.textContent = count;
        
        if (count === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
});












document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('propertyModal');
            const modalClose = document.getElementById('modalClose');
            const detailButtons = document.querySelectorAll('.property-details-btn');

            detailButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const card = this.closest('.property-card');
                    const img = card.querySelector('.property-image img').src;
                    const imgAlt = card.querySelector('.property-image img').alt;
                    const badge = card.querySelector('.property-badge').textContent;
                    const badgeClass = card.querySelector('.property-badge').classList.contains('badge-rent') ? 'badge-rent' : '';
                    const location = card.querySelector('.property-location').textContent.trim();
                    const title = card.querySelector('.property-title').textContent;
                    const price = card.querySelector('.property-price').innerHTML;
                    const description = card.querySelector('.property-description').textContent;
                    const features = Array.from(card.querySelectorAll('.feature-item')).map(f => f.innerHTML);

                    document.getElementById('modalImage').src = img;
                    document.getElementById('modalImage').alt = imgAlt;
                    document.getElementById('modalBadge').textContent = badge;
                    document.getElementById('modalBadge').className = 'modal-badge' + (badgeClass ? ' ' + badgeClass : '');
                    document.getElementById('modalLocation').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' + location;
                    document.getElementById('modalTitle').textContent = title;
                    document.getElementById('modalPrice').innerHTML = price;
                    document.getElementById('modalDescription').textContent = description;
                    document.getElementById('modalFeatures').innerHTML = features.map(f => '<div class="modal-feature-item">' + f + '</div>').join('');

                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            modalClose.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });

            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });






        document.addEventListener('DOMContentLoaded', function() {
            const slider = document.getElementById('testimonialsSlider');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const cards = document.querySelectorAll('.testimonial-card');
            
            let currentIndex = 0;
            const cardWidth = cards[0].offsetWidth;
            const gap = 40;
            const scrollAmount = cardWidth + gap;

            function updateSlider() {
                slider.scrollTo({
                    left: currentIndex * scrollAmount,
                    behavior: 'smooth'
                });

                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= cards.length - getVisibleCards();
            }

            function getVisibleCards() {
                const containerWidth = slider.offsetWidth;
                if (window.innerWidth > 1200) return 3;
                if (window.innerWidth > 768) return 2;
                return 1;
            }

            prevBtn.addEventListener('click', function() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });

            nextBtn.addEventListener('click', function() {
                if (currentIndex < cards.length - getVisibleCards()) {
                    currentIndex++;
                    updateSlider();
                }
            });

            let startX = 0;
            let scrollLeft = 0;

            slider.addEventListener('touchstart', function(e) {
                startX = e.touches[0].pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('touchmove', function(e) {
                const x = e.touches[0].pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                slider.scrollLeft = scrollLeft - walk;
            });

            slider.addEventListener('touchend', function() {
                const scrollPosition = slider.scrollLeft;
                currentIndex = Math.round(scrollPosition / scrollAmount);
                updateSlider();
            });

            window.addEventListener('resize', function() {
                currentIndex = 0;
                updateSlider();
            });

            updateSlider();
        });



        document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!fullName || !email || !phone || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            console.log('Form submitted:', {
                fullName,
                email,
                phone,
                message
            });
            
            alert('Thank you for contacting us! Our luxury real estate experts will reach out to you shortly.');
            
            contactForm.reset();
        });
        
        const formInputs = document.querySelectorAll('.form-input, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '' && this.hasAttribute('required')) {
                    this.style.borderColor = '#ff6b6b';
                } else {
                    this.style.borderColor = 'transparent';
                }
            });
            
            input.addEventListener('focus', function() {
                this.style.borderColor = '#BFA760';
            });
        });
    });






    document.addEventListener('DOMContentLoaded', function() {
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    });
                    
                    if (!isActive) {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                });
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    faqItems.forEach(item => {
                        item.classList.remove('active');
                        const question = item.querySelector('.faq-question');
                        question.setAttribute('aria-expanded', 'false');
                    });
                }
            });
        });





        const backToTopBtn = document.getElementById('backToTop');

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
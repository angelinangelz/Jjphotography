// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgb(255, 255, 255)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = 'block';
                item.classList.remove('hidden');
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

// Form validation
function validateForm() {
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const subject = document.getElementById('subject')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

// Contact form submission with validation
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link (this will open the user's email client)
        const mailtoLink = `mailto:alex@photography.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Thank you! Your message has been prepared. Please send it from your email client.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Notification function
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        ${type === 'success' ? 'background: #27ae60;' : 'background: #e74c3c;'}
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        }
    });
});

// Apply lazy loading to images (if you want to implement it)
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Portfolio lightbox functionality - IMPROVED VERSION
const portfolioItemsLightbox = document.querySelectorAll('.portfolio-item');
portfolioItemsLightbox.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || 'Image';
        const description = item.querySelector('p')?.textContent || 'Photography';
        
        if (img && img.src) {
            createLightbox(img.src, title, description);
        }
    });
});

function createLightbox(imageSrc, title, description) {
    // Remove any existing lightbox
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
        existingLightbox.remove();
    }

    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    // Create lightbox HTML
    lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <div class="lightbox-image-container">
                <img src="${imageSrc}" alt="${title}" class="lightbox-image">
            </div>
            <div class="lightbox-info">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        </div>
    `;

    // Add comprehensive lightbox styles
    const lightboxStyles = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            cursor: pointer;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 95vw;
            max-height: 95vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 10001;
        }
        
        .lightbox-close {
            position: absolute;
            top: -50px;
            right: 0;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 30px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10002;
        }
        
        .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        .lightbox-image-container {
            max-width: 90vw;
            max-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-image {
            max-width: 40%;
            max-height: 40%;
            width: 80%;
            height: 80%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-info {
            color: white;
            text-align: center;
            margin-top: 20px;
            max-width: 90vw;
        }
         .lightbox-image{
          max
         }
        .lightbox-info h3 {
            font-size: 1.5rem;
            margin: 0 0 10px 0;
            font-weight: 600;
        }
        
        .lightbox-info p {
            font-size: 1rem;
            margin: 0;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .lightbox-close {
                top: -40px;
                right: 10px;
                font-size: 24px;
                width: 35px;
                height: 35px;
            }
            
            .lightbox-image-container {
                max-width: 95vw;
                max-height: 75vh;
            }
                .lightbox-image{
            max-width: 60%;
            max-height: 60%;
            width: 80%;
            height: 80%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
             }
            
            
            .lightbox-info h3 {
                font-size: 1.2rem;
            }
            
            .lightbox-info p {
                font-size: 0.9rem;
            }
        }
    `;

    // Add styles to head if not already added
    if (!document.querySelector('#lightbox-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'lightbox-styles';
        styleSheet.textContent = lightboxStyles;
        document.head.appendChild(styleSheet);
    }

    // Add lightbox to body
    document.body.appendChild(lightbox);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Show lightbox with animation
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);

    // Close functionality
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            if (document.body.contains(lightbox)) {
                document.body.removeChild(lightbox);
            }
        }, 300);
    };

    // Event listeners for closing
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Prevent image click from closing lightbox
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    lightboxImage.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Preloader (optional)
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');

const backToTopStyles = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
`;

backToTopBtn.style.cssText = backToTopStyles;
document.body.appendChild(backToTopBtn);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

// Back to top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'scale(1.1)';
    backToTopBtn.style.background = '#c0392b';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'scale(1)';
    backToTopBtn.style.background = '#e74c3c';
});

// Additional CSS for fade-in animations (if not already in your CSS)
const animationStyles = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .portfolio-item {
        transition: all 0.3s ease;
    }
    
    .portfolio-item.hidden {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
    }
`;

// Add animation styles if not already present
if (!document.querySelector('#animation-styles')) {
    const animationStyleSheet = document.createElement('style');
    animationStyleSheet.id = 'animation-styles';
    animationStyleSheet.textContent = animationStyles;
    document.head.appendChild(animationStyleSheet);
}

// Enhanced portfolio filter with smooth animations
function enhancedPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // First hide all items
            portfolioItems.forEach(item => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
            });
            
            // Then show filtered items after a short delay
            setTimeout(() => {
                portfolioItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        if (item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            item.classList.remove('hidden');
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            setTimeout(() => {
                                item.style.display = 'none';
                                item.classList.add('hidden');
                            }, 300);
                        }
                    }
                });
            }, 150);
        });
    });
}

// Initialize enhanced portfolio filter
document.addEventListener('DOMContentLoaded', () => {
    enhancedPortfolioFilter();
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${this.src}`);
            // You can add a placeholder image here if needed
            // this.src = 'path/to/placeholder-image.jpg';
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    // Back to top button visibility
    if (window.scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
}, 10);

// Replace the existing scroll event listener with the debounced version
window.removeEventListener('scroll', () => {}); // Remove existing if any
window.addEventListener('scroll', debouncedScrollHandler);

// Console log for debugging
console.log('Portfolio website JavaScript loaded successfully!');

// Check if all required elements exist
document.addEventListener('DOMContentLoaded', () => {
    const requiredElements = [
        '.portfolio-item',
        '.filter-btn',
        '.navbar'
    ];
    
    requiredElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`Warning: No elements found for selector: ${selector}`);
        } else {
            console.log(`Found ${elements.length} elements for selector: ${selector}`);
        }
    });
});

// practices.js - Interactive functionality for Agroecological Practices page

document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching Between Practices and Crops
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons/sections
            tabButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active-section'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding section
            const targetSection = document.getElementById(`${button.dataset.category}-section`);
            targetSection.classList.add('active-section');
        });
    });

    // Expand/Collapse Practice Cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't toggle if user clicked on save button
            if(e.target.classList.contains('save-btn')) return;
            
            this.classList.toggle('active');
            
            // Close other open cards when opening a new one
            if(this.classList.contains('active')) {
                cards.forEach(otherCard => {
                    if(otherCard !== this && otherCard.classList.contains('active')) {
                        otherCard.classList.remove('active');
                    }
                });
            }
        });
    });

    // Region Filtering
    const regionSelect = document.getElementById('regions');
    regionSelect.addEventListener('change', function() {
        const selectedRegion = this.value;
        const allCards = document.querySelectorAll('.card');
        
        allCards.forEach(card => {
            if(selectedRegion === 'all' || card.dataset.regions.includes(selectedRegion)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Save/Bookmark Functionality
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card toggle when clicking save
            this.innerHTML = this.classList.toggle('saved') ?
                '<i class="fas fa-bookmark"></i> Saved' :
                '<i class="far fa-bookmark"></i> Save';
        });
    });
});
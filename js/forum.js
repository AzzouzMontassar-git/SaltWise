// forum.js - Interactive Forum Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Toggle comment visibility
    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const commentsSection = this.closest('.forum-topic').querySelector('.comments');
            commentsSection.classList.toggle('show-comments');
            this.classList.toggle('active');
            
            // Update button text
            const commentCount = this.textContent.match(/\d+/)[0];
            if (commentsSection.classList.contains('show-comments')) {
                this.innerHTML = `💬 ${commentCount} Comments <small>(hide)</small>`;
            } else {
                this.innerHTML = `💬 ${commentCount} Comments`;
            }
        });
    });

    // Like button functionality
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const likeCount = this.textContent.match(/\d+/)[0];
            
            if (this.classList.contains('active')) {
                this.innerHTML = `👍 ${parseInt(likeCount) + 1} Likes`;
            } else {
                this.innerHTML = `👍 ${likeCount} Likes`;
            }
        });
    });

    // Floating action button
    const fab = document.querySelector('.floating-action-btn');
    if (fab) {
        fab.addEventListener('click', function() {
            document.querySelector('.new-thread-form').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Comment submission (basic implementation)
    document.querySelectorAll('.post-comment-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const textarea = this.previousElementSibling;
            const commentText = textarea.value.trim();
            
            if (commentText) {
                const commentsSection = this.closest('.forum-topic').querySelector('.comments');
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <div class="comment-header">
                        <div class="user-avatar">Y</div>
                        <h4>You <span class="user-badge">New</span></h4>
                    </div>
                    <p>${commentText}</p>
                `;
                commentsSection.appendChild(newComment);
                textarea.value = '';
                
                // Ensure comments are visible
                commentsSection.classList.add('show-comments');
                const commentBtn = this.closest('.forum-topic').querySelector('.comment-btn');
                commentBtn.classList.add('active');
                
                // Update comment count
                const currentCount = parseInt(commentBtn.textContent.match(/\d+/)[0]);
                commentBtn.innerHTML = `💬 ${currentCount + 1} Comments <small>(hide)</small>`;
            }
        });
    });
});
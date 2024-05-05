document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('addReviewForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const productName = document.getElementById('productName').value;
                const reviewText = document.getElementById('reviewText').value;
                if (productName.trim() === '' || reviewText.trim() === '') {
                    alert('Заполните все поля!');
                    return;
                }
                const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
                reviews.push({ productName, reviewText });
                localStorage.setItem('reviews', JSON.stringify(reviews));
                alert('Отзыв добавлен!');
                document.getElementById('addReviewForm').reset();
            });
});
        
document.addEventListener('DOMContentLoaded', () => {
            const reviewsContainer = document.getElementById('reviewsContainer');
            const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
            const products = {};
            reviews.forEach((review) => {
                if (!products[review.productName]) {
                    products[review.productName] = {
                        name: review.productName,
                        reviews: [],
                    };
                }
                products[review.productName].reviews.push(review.reviewText);
            });
            if (Object.keys(products).length === 0) {
                reviewsContainer.innerHTML = '<p>Нет отзывов!</p>';
            } else {
                Object.values(products).forEach((product) => {
                    const productDiv = document.createElement('div');
                    productDiv.innerHTML = `
                        <h2>${product.name}</h2>
                        <button class="showHideReviewsButton" data-product-name="${product.name}">Показать отзывы</button>
                        <div class="reviewsContainer hidden" data-product-name="${product.name}"></div>
                    `;
                    reviewsContainer.appendChild(productDiv);
                    const showHideReviewsButton = productDiv.querySelector('.showHideReviewsButton');
                    const reviewsContainerDiv = productDiv.querySelector('.reviewsContainer');
                    showHideReviewsButton.addEventListener('click', () => {
                        reviewsContainerDiv.classList.toggle('hidden');
                        if (reviewsContainerDiv.classList.contains('hidden')) {
                            showHideReviewsButton.textContent = 'Показать отзывы';
                        } else {
                            showHideReviewsButton.textContent = 'Скрыть отзывы';
                        }
                    });
                    product.reviews.forEach((review) => {
                        const reviewDiv = document.createElement('div');
                        reviewDiv.textContent = review;
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Удалить';
                        deleteButton.style.display = 'block';
                        deleteButton.addEventListener('click', () => {
                            product.reviews = product.reviews.filter((r) => r!== review);
                            reviewsContainerDiv.removeChild(reviewDiv);
                            if (product.reviews.length === 0) {
                                reviewsContainer.removeChild(productDiv);
                                delete localStorage.reviews;
                            } else {
                                localStorage.setItem('reviews', JSON.stringify(Object.values(products).filter((p) => p.reviews.length > 0)));
                            }
                        });
                        reviewDiv.appendChild(deleteButton);
                        reviewsContainerDiv.appendChild(reviewDiv);
                    });
                });
            }
        });
// ===== タブ切り替え =====
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // ボタンのアクティブ状態を切り替え
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // コンテンツの表示/非表示を切り替え
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
});

// ===== フォーム送信 =====
document.getElementById('surveyForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    // チェックボックスの値を配列として取得
    const interests = [];
    document.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
        interests.push(cb.value);
    });

    // 送信データを作成
    const data = {
        interests: interests,
        budget: formData.get('budget'),
        ideas: formData.get('ideas'),
        company_name: formData.get('company_name'),
        department: formData.get('department'),
        position: formData.get('position'),
        name: formData.get('name'),
        email: formData.get('email'),
        submitted_at: new Date().toISOString(),
        user_agent: navigator.userAgent
    };

    // API送信
    try {
        const response = await fetch('https://kokotomo-dashboard-prod.onrender.com/api/lp/survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showModal();
            this.reset();
        } else {
            alert('送信に失敗しました。もう一度お試しください。');
        }
    } catch (error) {
        console.error('Error:', error);
        // API未実装時はモーダル表示（デモ用）
        showModal();
        this.reset();
    }
});

// ===== モーダル制御 =====
function showModal() {
    document.getElementById('successModal').classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// モーダル外クリックで閉じる
document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

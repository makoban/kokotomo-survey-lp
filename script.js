let formDataTemp = {}; // 送信データを一時保存

// ===== 確認モーダル表示処理 =====
// ===== 確認モーダル表示処理 =====
function confirmAndSend() {
    // 1. 入力値の取得
    const company = document.getElementById('company').value || '';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('tel').value || '';
    const message = document.getElementById('message').value || '';

    // チェックボックス (Interest)
    const interests = Array.from(document.querySelectorAll('input[name="interest"]:checked'))
                           .map(cb => cb.value)
                           .join(', ');

    // ラジオボタン (Budget)
    const budgetEl = document.querySelector('input[name="budget"]:checked');
    const budget = budgetEl ? budgetEl.value : '';

    // 必須チェック
    if (!company || !name || !email) {
        alert('必須項目（会社名、お名前、メール）を入力してください。');
        return;
    }

    // 2. 一時保存
    formDataTemp = {
        company: company,
        name: name,
        email: email,
        tel: tel,
        interest: interests,
        budget: budget,
        message: message
    };

    // 3. モーダルに値をセット
    document.getElementById('conf-company').textContent = company;
    document.getElementById('conf-name').textContent = name;
    document.getElementById('conf-email').textContent = email;
    document.getElementById('conf-tel').textContent = tel;

    // アンケート項目のセット（要素があれば）
    const confInterest = document.getElementById('conf-interest');
    if (confInterest) confInterest.textContent = interests || '（未選択）';

    const confBudget = document.getElementById('conf-budget');
    if (confBudget) confBudget.textContent = budget || '（未選択）';

    document.getElementById('conf-message').textContent = message;

    // 4. 確認モーダル表示
    document.getElementById('confirmModal').style.display = 'flex';
}

// ===== モーダル操作 =====
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// ===== 実際の送信処理 =====
function executeSend() {
    const submitBtn = document.querySelector('.submit-btn-real');
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;

    // Web3Formsの設定
    const accessKey = '18e5fc30-492e-4cbc-994f-50baddd58d4c';

    // 送信データを作成
    const sendData = {
        access_key: accessKey,
        subject: '【ココトモLP】お問い合わせ・無料体験申し込み',
        from_name: 'Kokotomo LP',
        ...formDataTemp
    };

    // 送信実行
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // 送信成功
            closeConfirmModal();
            document.getElementById('successModal').style.display = 'flex';
            document.getElementById('contactForm').reset();
        } else {
            console.error('送信エラー:', result);
            alert('送信に失敗しました。時間をおいて再度お試しください。');
        }
    })
    .catch(error => {
        console.error('通信エラー:', error);
        alert('通信エラーが発生しました。ネットワーク環境をご確認ください。');
    })
    .finally(() => {
        submitBtn.textContent = '送信する';
        submitBtn.disabled = false;
    });
}

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

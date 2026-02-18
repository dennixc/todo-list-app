// ==========================================
// 資料遷移腳本：為現有任務新增 completedAt 欄位
// ==========================================
// 使用方法：
// 1. 開啟應用程式（index.html）
// 2. 開啟瀏覽器開發者工具（F12）
// 3. 複製下方函數到 Console 並執行
// ==========================================

async function migrateTodos() {
    console.log('🔄 開始遷移任務資料...');

    try {
        // 從全域取得 Firebase 函數
        const firebase = window.firebaseDB;
        if (!firebase) {
            console.error('❌ Firebase 尚未初始化，請稍後再試');
            return;
        }

        const { db, collection, getDocs, doc, updateDoc } = firebase;

        const todosCollection = collection(db, 'todos');
        const snapshot = await getDocs(todosCollection);

        console.log(`📊 找到 ${snapshot.size} 個任務`);

        const updates = [];
        let migratedCount = 0;

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            // 檢查是否需要遷移
            if (!data.hasOwnProperty('completedAt')) {
                const todoRef = doc(db, 'todos', docSnap.id);

                // 如果已完成，使用 createdAt 作為 completedAt；否則設為 null
                const completedAt = data.completed ? (data.createdAt || new Date()) : null;

                updates.push(
                    updateDoc(todoRef, {
                        completedAt: completedAt,
                        order: data.order ?? 0
                    })
                );

                migratedCount++;
                console.log(`  ⏳ 遷移任務: ${data.text.substring(0, 30)}...`);
            }
        });

        if (updates.length === 0) {
            console.log('✅ 所有任務都已經有 completedAt 欄位，無需遷移');
            return;
        }

        await Promise.all(updates);
        console.log(`✅ 成功遷移 ${migratedCount} 個任務！`);
        console.log('🎉 遷移完成，請重新整理頁面查看效果');

    } catch (error) {
        console.error('❌ 遷移失敗:', error);
        console.error('請確認網路連線並重試');
    }
}

// 執行遷移（取消下方註解以執行）
// migrateTodos();

console.log('📝 遷移腳本已載入！');
console.log('💡 執行以下命令開始遷移：');
console.log('   migrateTodos()');

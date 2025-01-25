const chatBox = document.getElementById('chatBox');
        const encryptionKeyInput = document.getElementById('encryptionKey');
        const messageInput = document.getElementById('messageInput');

        // Load chat history from local storage
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

        function sendMessage() {
            const message = messageInput.value.trim();
            const key = encryptionKeyInput.value.trim();

            if (!message || !key) {
                alert('Please enter both a message and an encryption key.');
                return;
            }

            // Encrypt the message
            const encryptedMessage = CryptoJS.AES.encrypt(message, key).toString();

            // Add to chat history
            chatHistory.push({ encrypted: encryptedMessage });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            updateChatBox();

            // Clear the input field
            messageInput.value = '';
        }

        function updateChatBox() {
            chatBox.innerHTML = '';
            const key = encryptionKeyInput.value.trim();

            chatHistory.forEach((chat) => {
                const messageDiv = document.createElement('div');

                if (key) {
                    try {
                        // Try to decrypt the message
                        const decryptedBytes = CryptoJS.AES.decrypt(chat.encrypted, key);
                        const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

                        if (decryptedMessage) {
                            messageDiv.textContent = `Decrypted: ${decryptedMessage}`;
                            messageDiv.className = 'decrypted';
                        } else {
                            throw new Error('Invalid key');
                        }
                    } catch {
                        messageDiv.textContent = `Encrypted: ${chat.encrypted}`;
                        messageDiv.className = 'encrypted';
                    }
                } else {
                    messageDiv.textContent = `Encrypted: ${chat.encrypted}`;
                    messageDiv.className = 'encrypted';
                }

                chatBox.appendChild(messageDiv);
            });

            // Scroll to the bottom of the chat box
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function clearHistory() {
            if (confirm('Are you sure you want to clear the chat history?')) {
                chatHistory = [];
                localStorage.removeItem('chatHistory');
                updateChatBox();
            }
        }

        // Update chat box whenever the encryption key changes
        encryptionKeyInput.addEventListener('input', updateChatBox);

        // Initialize chat box with history
        updateChatBox();
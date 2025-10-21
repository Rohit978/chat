<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WhatsApp Clone — Functional</title>
  <style>
    :root{--bg:#0b141a;--panel:#111b21;--muted:#667781;--accent:#00a884;--text:#e9edef;--card:#202c33;--surface:#2a3942}
    [data-theme="light"]{--bg:#f7f9fa;--panel:#fff;--muted:#6b7280;--accent:#0b8457;--text:#0b141a;--card:#f3f4f6;--surface:#e5e7eb}
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;font-family:Inter,Segoe UI,system-ui,Arial;background:var(--bg);color:var(--text)}
    .app{display:flex;height:100vh;max-width:1400px;margin:16px auto;background:linear-gradient(180deg,var(--panel),#0a1216);border-radius:8px;overflow:hidden}
    .sidebar{width:340px;background:var(--panel);border-right:1px solid rgba(255,255,255,.03);display:flex;flex-direction:column}
    .topbar{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:var(--card)}
    .user{display:flex;align-items:center;gap:12px}
    .avatar{width:44px;height:44px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700}
    .controls{display:flex;gap:8px;align-items:center}
    .icon{cursor:pointer;padding:8px;border-radius:8px}
    .search{padding:10px}
    .search input{width:100%;padding:10px;border-radius:10px;border:0;background:var(--surface);color:var(--text)}
    .chats{flex:1;overflow:auto}
    .chat-item{display:flex;gap:12px;padding:12px;border-bottom:1px solid rgba(255,255,255,.02);align-items:center;cursor:pointer}
    .chat-item .meta{margin-left:auto;text-align:right}
    .chat-item .name{font-weight:600}
    .chat-item .preview{color:var(--muted);max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .main{flex:1;display:flex;flex-direction:column}
    .header{height:64px;background:var(--card);display:flex;align-items:center;gap:12px;padding:0 16px;border-bottom:1px solid rgba(255,255,255,.02)}
    .messages{flex:1;overflow:auto;padding:20px;background:linear-gradient(180deg,transparent,rgba(0,0,0,.02))}
    .message{max-width:70%;margin-bottom:12px;padding:10px 12px;border-radius:10px;position:relative}
    .message.me{margin-left:auto;background:linear-gradient(180deg,#076b4a,#005c4b);color:#fff}
    .message.them{background:var(--card);color:var(--text)}
    .meta{font-size:11px;color:var(--muted);margin-top:6px}
    .inputbox{display:flex;gap:8px;padding:12px;background:var(--card);align-items:center}
    .inputbox input{flex:1;padding:12px;border-radius:10px;border:0;background:var(--surface);color:var(--text)}
    .btn{padding:10px 12px;border-radius:8px;background:var(--accent);color:#fff;border:0;cursor:pointer}
    .profile-modal,.group-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--panel);padding:20px;border-radius:12px;z-index:200;min-width:320px;box-shadow:0 8px 30px rgba(0,0,0,.4)}
    .hidden{display:none}
    .small{font-size:12px;color:var(--muted)}
    .toast{position:fixed;right:20px;bottom:20px;background:#0b1220;padding:12px;border-radius:8px;color:#fff}
    .auth-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:300}
    .auth-box{width:100%;max-width:420px;background:var(--card);padding:20px;border-radius:10px}
    .auth-box input{width:100%;padding:12px;border-radius:8px;border:0;background:var(--surface);color:var(--text);margin-bottom:10px}
    .auth-tabs{display:flex;gap:8px;margin-bottom:10px}
    .link{color:var(--accent);cursor:pointer}
    @media(max-width:900px){.sidebar{display:none}.app{flex-direction:column;height:100vh}.main{height:100vh}}
  </style>
</head>
<body>
  <div id="app" class="app" data-theme="dark">
    <div class="sidebar">
      <div class="topbar">
        <div class="user">
          <div id="myAvatar" class="avatar">U</div>
          <div>
            <div id="myName">Not signed</div>
            <div id="myStatus" class="small">offline</div>
          </div>
        </div>
        <div class="controls">
          <div id="themeToggle" class="icon" title="Toggle theme">🌓</div>
          <div id="profileBtn" class="icon" title="Profile">⚙️</div>
          <div id="logoutBtn" class="icon" title="Logout">🚪</div>
        </div>
      </div>
      <div class="search"><input id="search" placeholder="Search or start new chat" /></div>
      <div class="chats" id="chatsList"></div>
    </div>

    <div class="main">
      <div id="header" class="header">
        <div style="display:flex;align-items:center;gap:12px">
          <div id="activeAvatar" class="avatar">C</div>
          <div>
            <div id="activeName">Welcome</div>
            <div id="activePresence" class="small">Select a chat to start</div>
          </div>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
          <div id="typingIndicator" class="small"></div>
        </div>
      </div>

      <div id="messages" class="messages"></div>

      <div class="inputbox">
        <input id="msgInput" placeholder="Type a message" />
        <input id="fileInput" type="file" style="display:none" accept="image/*" />
        <button id="attachBtn" class="btn">📎</button>
        <button id="sendBtn" class="btn">Send</button>
      </div>
    </div>
  </div>

  <!-- Profile Modal -->
  <div id="profileModal" class="profile-modal hidden">
    <h3>Profile</h3>
    <div style="display:flex;gap:10px;align-items:center;margin-top:10px">
      <div id="profileAvatar" class="avatar">U</div>
      <div>
        <input id="profileName" placeholder="Display name" />
        <div style="margin-top:8px">
          <input id="avatarFile" type="file" accept="image/*" />
        </div>
      </div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px">
      <button id="saveProfile" class="btn">Save</button>
      <button id="closeProfile" class="btn" style="background:#444">Close</button>
    </div>
  </div>

  <div id="toast" class="toast hidden"></div>

  <!-- Auth Modal (email/password) -->
  <div id="authModal" class="auth-modal hidden">
    <div class="auth-box">
      <h2 style="margin-bottom:8px">Sign in</h2>
      <div class="auth-tabs">
        <div id="tabLogin" class="link">Login</div>
        <div id="tabSignup" class="link">Sign Up</div>
      </div>
      <div id="loginView">
        <input id="loginEmail" placeholder="Email" type="email" />
        <input id="loginPassword" placeholder="Password" type="password" />
        <div style="display:flex;gap:8px"><button id="loginBtn" class="btn">Log In</button><button id="toSignup" class="btn" style="background:#444">Create account</button></div>
        <div id="authError" class="small" style="color:#ea4335;margin-top:8px"></div>
      </div>
      <div id="signupView" class="hidden">
        <input id="signupName" placeholder="Display name" />
        <input id="signupEmail" placeholder="Email" type="email" />
        <input id="signupPassword" placeholder="Password (min 6)" type="password" />
        <div style="display:flex;gap:8px;margin-top:6px"><button id="signupBtn" class="btn">Sign Up</button><button id="toLogin" class="btn" style="background:#444">Back</button></div>
        <div id="signupError" class="small" style="color:#ea4335;margin-top:8px"></div>
      </div>
    </div>
  </div>

  <!-- Firebase libs -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-app-compat.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-auth-compat.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-database-compat.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-storage-compat.min.js"></script>

  <script>
    // --- Firebase configuration (kept from your original file) ---
    const firebaseConfig = {
      apiKey: "AIzaSyCPbSkHLS1QDKWsBIvJrqAA0BdmMdhLcfQ",
      authDomain: "chatroom-1390e.firebaseapp.com",
      projectId: "chatroom-1390e",
      storageBucket: "chatroom-1390e.firebasestorage.app",
      messagingSenderId: "922917055467",
      appId: "1:922917055467:web:1816ab1d5ad8d9481bc7ae",
      measurementId: "G-1M4WG2FEYJ"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();
    const storage = firebase.storage();

    // --- UI refs ---
    const chatsList = document.getElementById('chatsList');
    const messagesEl = document.getElementById('messages');
    const msgInput = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    const myAvatar = document.getElementById('myAvatar');
    const myName = document.getElementById('myName');
    const myStatus = document.getElementById('myStatus');
    const activeName = document.getElementById('activeName');
    const activeAvatar = document.getElementById('activeAvatar');
    const activePresence = document.getElementById('activePresence');
    const typingIndicator = document.getElementById('typingIndicator');
    const themeToggle = document.getElementById('themeToggle');
    const profileBtn = document.getElementById('profileBtn');
    const profileModal = document.getElementById('profileModal');
    const profileName = document.getElementById('profileName');
    const profileAvatar = document.getElementById('profileAvatar');
    const avatarFile = document.getElementById('avatarFile');
    const saveProfile = document.getElementById('saveProfile');
    const closeProfile = document.getElementById('closeProfile');
    const logoutBtn = document.getElementById('logoutBtn');
    const toast = document.getElementById('toast');

    // Auth modal refs
    const authModal = document.getElementById('authModal');
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const toSignup = document.getElementById('toSignup');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupBtn = document.getElementById('signupBtn');
    const toLogin = document.getElementById('toLogin');
    const authError = document.getElementById('authError');
    const signupError = document.getElementById('signupError');

    // State
    let currentUser = null;
    let activeChatId = null;
    let messageListener = null;
    let typingTimeout = null;

    // Utils
    function showToast(msg, t=2000){toast.textContent=msg;toast.classList.remove('hidden');setTimeout(()=>toast.classList.add('hidden'),t)}
    function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

    // --- Auth flows ---
    tabLogin.onclick = ()=>{ loginView.classList.remove('hidden'); signupView.classList.add('hidden'); }
    tabSignup.onclick = ()=>{ signupView.classList.remove('hidden'); loginView.classList.add('hidden'); }
    toSignup.onclick = ()=>{ signupView.classList.remove('hidden'); loginView.classList.add('hidden'); }
    toLogin.onclick = ()=>{ loginView.classList.remove('hidden'); signupView.classList.add('hidden'); }

    loginBtn.onclick = ()=>{
      const email = loginEmail.value.trim(); const pw = loginPassword.value;
      authError.textContent='';
      if(!email||!pw){ authError.textContent='Enter email and password'; return; }
      auth.signInWithEmailAndPassword(email,pw).catch(err=>{ authError.textContent = err.message; });
    }

    signupBtn.onclick = ()=>{
      const name = signupName.value.trim(); const email = signupEmail.value.trim(); const pw = signupPassword.value;
      signupError.textContent='';
      if(!name||!email||!pw){ signupError.textContent='Fill all fields'; return; }
      if(pw.length<6){ signupError.textContent='Password must be >=6 chars'; return; }
      auth.createUserWithEmailAndPassword(email,pw).then(uc=>{
        return uc.user.updateProfile({displayName:name}).then(()=>{
          // create user record
          db.ref('users/'+uc.user.uid).set({displayName:name,email:email,createdAt:Date.now(),uid:uc.user.uid});
        });
      }).catch(err=> signupError.textContent = err.message);
    }

    logoutBtn.onclick = ()=>{ if(!currentUser) return; setPresence('offline'); auth.signOut(); }

    // --- On auth state changed ---
    auth.onAuthStateChanged(user=>{
      if(user){ currentUser = user; hideAuth(); setupUIForUser(user); listenForChats(); setPresence('online'); window.addEventListener('beforeunload', ()=> setPresence('offline')); }
      else { currentUser = null; showAuth(); clearUI(); }
    });

    function showAuth(){ authModal.classList.remove('hidden'); }
    function hideAuth(){ authModal.classList.add('hidden'); }

    function clearUI(){ chatsList.innerHTML=''; messagesEl.innerHTML=''; myName.textContent='Not signed'; myAvatar.textContent='U'; myStatus.textContent='offline'; }

    function setupUIForUser(user){ const name = user.displayName || user.email.split('@')[0]; myAvatar.textContent = (name||'U').charAt(0).toUpperCase(); myName.textContent = name; profileAvatar.textContent = myAvatar.textContent; profileName.value = name; myStatus.textContent = 'online'; }

    // --- Presence management ---
    function setPresence(state){ if(!currentUser) return; const ref = db.ref('status/'+currentUser.uid); ref.set({state:state,lastSeen:Date.now()}); if(state==='online') ref.onDisconnect().set({state:'offline',lastSeen:Date.now()}); }

    // --- Chats list ---
    function listenForChats(){ if(!currentUser) return; const uref = db.ref('user_chats/'+currentUser.uid); uref.on('value', snap=>{ const data = snap.val() || {}; const items = Object.keys(data).map(k=>({chatId:k,...data[k]})); renderChats(items); }); }

    function renderChats(list){ chatsList.innerHTML=''; if(list.length===0){ // show default groups
        list = [{chatId:'WorldChat',name:'World Chat',preview:'Welcome to World Chat',lastTs:Date.now()},{chatId:'DevTeam',name:'Dev Team',preview:'Dev talk',lastTs:Date.now()-3600000}]; }
      list.sort((a,b)=> (b.lastTs||0)-(a.lastTs||0)); list.forEach(c=>{
        const item = document.createElement('div'); item.className='chat-item';
        item.innerHTML = `<div class="avatar">${escapeHtml((c.name||'C').charAt(0))}</div><div style="margin-left:8px"><div class="name">${escapeHtml(c.name||'Chat')}</div><div class="preview">${escapeHtml(c.preview||'Click to open')}</div></div><div class="meta"><div class="small">${c.lastTs?new Date(c.lastTs).toLocaleTimeString():''}</div></div>`;
        item.onclick = ()=> openChat(c.chatId,c.name);
        chatsList.appendChild(item);
      }); }

    // --- Open chat & message listener ---
    function openChat(chatId,name){ activeChatId = chatId; activeName.textContent = name; activeAvatar.textContent = (name||'C').charAt(0); messagesEl.innerHTML=''; db.ref('user_chats/'+currentUser.uid+'/'+chatId).update({name:name,lastTs:Date.now()}); if(messageListener) messageListener.off(); const ref = db.ref('chats/'+chatId+'/messages'); messageListener = ref.limitToLast(200); messageListener.on('child_added', snap=>{ const m = snap.val(); m._key = snap.key; renderMessage(m); markRead(snap.key); }); messageListener.on('child_changed', snap=>{ const m = snap.val(); m._key = snap.key; updateMessageUI(m); }); // listen presence of participants optionally
    }

    function renderMessage(m){ const el = document.createElement('div'); el.id = 'msg_'+m._key; el.className = 'message ' + (m.userId===currentUser.uid?'me':'them'); let html=''; if(m.imageUrl) html += `<div><img src="${escapeHtml(m.imageUrl)}" style="max-width:100%;border-radius:8px;cursor:pointer" onclick="window.open('${m.imageUrl}','_blank')"/></div>`; if(m.text) html += `<div>${escapeHtml(m.text)}</div>`; html += `<div class="meta">${new Date(m.timestamp||Date.now()).toLocaleString()} ${(m.userId===currentUser.uid)?'<button data-id="'+m._key+'" onclick="editMessage(event)" style="margin-left:8px">Edit</button><button data-id="'+m._key+'" onclick="deleteMessage(event)" style="margin-left:6px">Delete</button>':''} <span style="margin-left:8px">${m.readBy?Object.keys(m.readBy).length>0?('Read by '+Object.keys(m.readBy).length):'':''}</span></div>`; el.innerHTML = html; messagesEl.appendChild(el); messagesEl.scrollTop = messagesEl.scrollHeight; }

    function updateMessageUI(m){ const el = document.getElementById('msg_'+m._key); if(!el) return renderMessage(m); const meta = el.querySelector('.meta'); if(meta) meta.innerHTML = `${new Date(m.timestamp||Date.now()).toLocaleString()} ${(m.userId===currentUser.uid)?'<button data-id="'+m._key+'" onclick="editMessage(event)" style="margin-left:8px">Edit</button><button data-id="'+m._key+'" onclick="deleteMessage(event)" style="margin-left:6px">Delete</button>':''} <span style="margin-left:8px">${m.readBy?Object.keys(m.readBy).length>0?('Read by '+Object.keys(m.readBy).length):'':''}</span>` }

    // --- Send message ---
    sendBtn.onclick = async ()=>{ if(!activeChatId){ showToast('Open a chat first'); return; } const text = msgInput.value.trim(); if(!text) return; const ref = db.ref('chats/'+activeChatId+'/messages'); const msg = {text:text,userId:currentUser.uid,senderName:currentUser.displayName||currentUser.email.split('@')[0],timestamp:Date.now()}; const nref = ref.push(); await nref.set(msg); db.ref('chats/'+activeChatId).update({lastTs:Date.now(),preview:text}); db.ref('user_chats/'+currentUser.uid+'/'+activeChatId).update({lastTs:Date.now(),preview:text}); msgInput.value=''; }

    // --- File upload ---
    attachBtn.onclick = ()=> fileInput.click();
    fileInput.onchange = async (e)=>{ const f = e.target.files[0]; if(!f) return; if(!activeChatId){ showToast('Open chat to send media'); return; } const path = 'chat_media/'+activeChatId+'/'+currentUser.uid+'_'+Date.now()+'_'+f.name; const upl = storage.ref(path).put(f); showToast('Uploading...'); upl.on('state_changed', snap=>{}, err=>{ showToast('Upload failed') }, async ()=>{ const url = await upl.snapshot.ref.getDownloadURL(); const ref = db.ref('chats/'+activeChatId+'/messages'); const nref = ref.push(); await nref.set({imageUrl:url,userId:currentUser.uid,senderName:currentUser.displayName||'',timestamp:Date.now()}); db.ref('chats/'+activeChatId).update({lastTs:Date.now(),preview:'📷 Image'}); showToast('Uploaded'); }); }

    // --- Edit & Delete ---
    window.editMessage = function(ev){ ev.stopPropagation(); const id = ev.currentTarget.getAttribute('data-id'); const txt = prompt('Edit message:'); if(txt!==null){ db.ref('chats/'+activeChatId+'/messages/'+id).update({text:txt,edited:true,editedAt:Date.now()}); } }
    window.deleteMessage = function(ev){ ev.stopPropagation(); const id = ev.currentTarget.getAttribute('data-id'); if(confirm('Delete this message?')) db.ref('chats/'+activeChatId+'/messages/'+id).remove(); }

    // --- Read receipts ---
    function markRead(msgKey){ if(!activeChatId || !currentUser) return; const readRef = db.ref('chats/'+activeChatId+'/messages/'+msgKey+'/readBy/'+currentUser.uid); readRef.set(true); }

    // --- Typing indicator ---
    msgInput.addEventListener('input', ()=>{ if(!activeChatId||!currentUser) return; db.ref('typing/'+activeChatId+'/'+currentUser.uid).set(true); clearTimeout(typingTimeout); typingTimeout = setTimeout(()=>db.ref('typing/'+activeChatId+'/'+currentUser.uid).remove(),1500); });
    setInterval(()=>{ if(!activeChatId) return; db.ref('typing/'+activeChatId).once('value', snap=>{ const data = snap.val()||{}; if(currentUser) delete data[currentUser.uid]; const people = Object.keys(data||{}); typingIndicator.textContent = people.length? (people.join(', ')+' is typing...') : ''; }) },800);

    // --- Profile modal ---
    profileBtn.onclick = ()=> profileModal.classList.remove('hidden');
    closeProfile.onclick = ()=> profileModal.classList.add('hidden');
    saveProfile.onclick = async ()=>{
      const newName = profileName.value.trim(); if(!newName) return alert('Enter a name'); const file = avatarFile.files[0];
      if(file){ const path = 'avatars/'+currentUser.uid+'_'+Date.now()+'_'+file.name; const upl = await storage.ref(path).put(file); const url = await upl.ref.getDownloadURL(); await currentUser.updateProfile({displayName:newName,photoURL:url}); db.ref('users/'+currentUser.uid).update({displayName:newName,photoURL:url,updatedAt:Date.now()}); }
      else { await currentUser.updateProfile({displayName:newName}); db.ref('users/'+currentUser.uid).update({displayName:newName,updatedAt:Date.now()}); }
      setupUIForUser(currentUser); profileModal.classList.add('hidden'); showToast('Profile updated'); }

    // --- Theme toggle ---
    themeToggle.onclick = ()=>{ const el = document.getElementById('app'); const cur = el.getAttribute('data-theme'); const next = cur==='dark'?'light':'dark'; el.setAttribute('data-theme',next); localStorage.setItem('theme',next); }
    (function(){ const t = localStorage.getItem('theme')||'dark'; document.getElementById('app').setAttribute('data-theme',t); })();

    // --- Search new user & start private chat ---
    document.getElementById('search').addEventListener('keypress', async (e)=>{ if(e.key==='Enter'){ const q = e.target.value.trim(); if(!q) return; // search users by displayName or email
        const snapshot = await db.ref('users').orderByChild('displayName').startAt(q).endAt(q+'\uf8ff').once('value'); const data = snapshot.val() || {};
        const keys = Object.keys(data);
        if(keys.length===0){ showToast('No users found'); return; }
        // open chat with first match for simplicity
        const other = data[keys[0]]; const uids = [currentUser.uid, other.uid].sort(); const chatId = 'private_'+uids.join('_'); // create chat metadata
        db.ref('chats/'+chatId).once('value',snap=>{ if(!snap.exists()){ db.ref('chats/'+chatId).set({isPrivate:true,users:{[currentUser.uid]:true,[other.uid]:true},name:other.displayName}); }
          // add to user_chats for both users
          db.ref('user_chats/'+currentUser.uid+'/'+chatId).set({name:other.displayName,preview:'',lastTs:Date.now()}); db.ref('user_chats/'+other.uid+'/'+chatId).set({name:currentUser.displayName||currentUser.email.split('@')[0],preview:'',lastTs:Date.now()});
          openChat(chatId, other.displayName);
        }); }
    });

    // --- Utilities: clear listeners on unload ---
    window.addEventListener('beforeunload', ()=>{ if(messageListener) messageListener.off(); if(currentUser) setPresence('offline'); });

    // --- Basic DB rules reminder (you'll need to set rules in Firebase Console) ---
    /*
      Recommended Realtime Database rules (example, adapt for production):
      {
        "rules": {
          "users": {
            "$uid": { 
              ".read": "auth != null",
              ".write": "auth != null && auth.uid == $uid"
            }
          },
          "user_chats": {
            "$uid": {
              ".read": "auth != null && auth.uid == $uid",
              ".write": "auth != null && auth.uid == $uid"
            }
          },
          "chats": {
            "$chatId": {
              ".read": "auth != null", // further restrict by membership if you add users map
              ".write": "auth != null"
            }
          },
          "status": {"$uid": {".write": "auth != null && auth.uid == $uid",".read": "auth != null"}},
          "typing": {"$chatId": {"$uid": {".write": "auth != null && auth.uid == $uid",".read": "auth != null"}}}
        }
      }
    */

  </script>
</body>
</html>

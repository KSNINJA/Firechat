// Initialize Firebase
var config = {
    // put your own app config here
};
firebase.initializeApp(config);


var current_chat = null;

var database = firebase.firestore();
database.settings({
    timestampsInSnapshots: true
});
var chatref = database.collection('chats');
var usersref = database.collection('users');
var message_input = $('[name="message"]');
var email;
var photoURL;
var userInfo;
var displayName;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        userInfo = user;
        displayName = user.displayName;
        email = user.email;
        photoURL = user.photoURL;
        if (photoURL != undefined) {
            $('#myprofile-img').css('background-image', `url('${photoURL}')`);
        }
        $('#firebaseui-auth-container').css('display', 'none');
        var mychatsref = database.collection('users').doc(`${email}`);
        database.collection('users').doc(email).get().then(function(returnVal) {
            if (returnVal.data() == undefined) {
                usersref.doc(email).set({
                    email: email,
                    mychatlist: null,
                    displayName: displayName,
                    visibleToOthers: true,
                    photoURL: 'images/person.jpg'
                });
            }
        });
        var mychats = [];
        mychatsref.onSnapshot(function(snapshot) {
            var chats = snapshot.data().mychatlist;
            chats = chats.splice(mychats.length);
            chats.forEach(function(chat) {
                chatref.doc(chat).get().then(function(values) {
                    values = values.data();
                    var chat_name = values.chatName;
                    var recipients = values.recipient;
                    var isPersonalChat = values.personalChat;
                    var otherPerson;
                    var chat_img = values.chatImage;
                    if (isPersonalChat) {
                        if (recipients[0] == email) {
                            otherPerson = values.recipient[1];
                        } else {
                            otherPerson = values.recipient[0];
                        }
                        usersref.doc(otherPerson).get().then(function(snapshot) {
                            chat_img = snapshot.data().photoURL;
                            chat_name = snapshot.data().displayName;
                            var html = ` <div id="${chat}" class="chat-lobby-item" style="overflow: hidden; height: 70px;"> 
                                        <div class="background-image-holder" style="height: 50px ;width:50px ; border-radius: 100%;background-image: url('${chat_img}'); display: inline-block; vertical-align: middle; margin: 10px;">
                                        </div>
                                        <span >${chat_name}</span>
                                     </div>
                                     <hr style="margin: 0px;">`;
                            $('.chat-lobby').prepend(html);
                            addClickListenerToEachChat(chat, chat_name, chat_img, recipients, isPersonalChat);
                        });
                    } else {
                        var html = ` <div id="${chat}" class="chat-lobby-item" style="overflow: hidden; height: 70px;"> 
                      <div class="background-image-holder" style="height: 50px ;width:50px ; border-radius: 100%;background-image: url('${chat_img}'); display: inline-block; vertical-align: middle; margin: 10px;">
                          </div>
                                 <span >${chat_name}</span>
                                  </div>
                                 <hr style="margin: 0px;">`;
                        $('.chat-lobby').prepend(html);
                        addClickListenerToEachChat(chat, chat_name, chat_img, recipients, isPersonalChat);
                    }
                    mychats.push(chat);
                });
            });
        });
    } else {
        // User is signed out.
        tearDownUi();
        $('#firebaseui-auth-container').css('display', 'block');
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        var uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return true;
                },
                uiShown: function() {
                    // The widget is rendered.
                    // Hide the loader.
                    document.getElementById('loader').style.display = 'none';
                }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: 'https://ksninja.github.io/Firechat',
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
        };
        ui.start('#firebaseui-auth-container', uiConfig);
    }
});

function addClickListenerToEachChat(chat, chat_name, chat_img, recipients, isPersonalChat) {
    $('.chat-lobby').children().first().on('click', function() {
        $('#message-list').empty();
        $('#messaging-chat-name').text(chat_name);
        if (!isPersonalChat) {
            var displayRecipient = '';
            for (var i = 0; i < recipients.length; i++) {
                usersref.doc(recipients[i]).get().then(function(userInfo) {
                    displayRecipient += userInfo.data().displayName;
                    displayRecipient += ' ';
                    $('#messaging-chat-recipients').css('display','inline-block');
                    $('#messaging-chat-recipients').text(displayRecipient);
                })
            }
        }
        else{
          $('#messaging-chat-recipients').css('display',''); // This sets its display to default display set to it in its class
        }
        $('#messaging-chat-img').css('background-image', `url('${chat_img}')`);
        $(message_input).off('keyup');
        $('#send-message-btn').off('click'); //Remove the previous click listener from attaching another
        addMessageInputListner(chat, email);
        if (current_chat != null) {
            RemoveAndAddChildEventListnerToPreviousChat();
        }
        $('[name="message"]').data('chat', chat);
        current_chat = $('[name="message"]').data('chat');
        addValueListener(chat, email);
        var vw = $(window).width();
        $('.messaging-column').css('display', 'inline-block');
        if (vw <= 768) {
            $('.messaging-column').css('z-index', '300');
            $('.messaging-column').animate({
                right: '0px'
            }, 300, 'swing');
        }
    });
}

function addMessageInputListner(chat, email) {
    $(message_input).on('keyup', function(key) {
        if (key.keyCode == 13) {
            $('#send-message-btn').trigger('click');
        }
    });
    $('#send-message-btn').click(function() {
        $('#type-message-div .page-btn').addClass('page-btn-clicked');
        var message_string = $(message_input).val()
        $(message_input).val('');
        var date = new Date();
        var time = date.getHours() + ':' + date.getMinutes();
        var messageObj = {
            content: message_string,
            time: time,
            sender: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        database.collection('chats').doc(chat).collection('messages').add(messageObj);
        setTimeout(function() {
            $('#type-message-div .page-btn').removeClass('page-btn-clicked');
        }, 100);
    });
}
var chatMessagesListener;
function addValueListener(chat, email) {
    var mymessages = 0;
    chatMessagesListener = chatref.doc(chat).collection('messages').orderBy('timestamp', 'asc').onSnapshot(function(response) {
        response = response.docs;
        response.splice(0, mymessages);
        response.forEach(function(message) {
            message = message.data();
            var message_string = message.content;
            var sender = message.sender; // Decrypting the sender's email
            var time = message.time;
            var bgcolor = '#fff';
            var position = 'left';
            if (sender == email) {
                bgcolor = 'rgb(225,247,202)';
                position = 'right';
            }
            var html = `<div style='float: ${position};text-align: ${position};width: 100%;'>
            <div style='background-color:${bgcolor};padding: 20px 20px 20px 20px;max-width: 85%;min-width: 60px; display: inline-block;margin: 10px 8vw 10px 8vw;
               border-radius: 10%;text-align: left;'>
                 <div style='text-overflow: ellipsis;overflow: hidden;padding-right: 20px;font-size:14px'>
                     ${message_string}
                 </div>
                 <div style='color: rgb(99,116,88);font-size: 10px;float: right; display: inline-block'>${time}</div>
              </div>
              </div>`
            $('#message-list').append(html);
        });
        mymessages += response.length;
    });
}

function RemoveAndAddChildEventListnerToPreviousChat() {
    chatMessagesListener(); // detach listener
}

function tearDownUi() {
    $('.chat-lobby').empty();
    $('#message-list').empty();
}
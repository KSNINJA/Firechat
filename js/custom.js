/*$(document).ready(function() {
    $("body").on("contextmenu",function(e){
       return false;
    }); 
}); */
$('#new-chat-icon').click(function() {
    $('#new-chat-column').css('display', 'inline-block');
    $('#new-chat-column').animate({
        left: '0px'
    }, 300, 'swing');
    addListenerToFindPeopleForPersonalChat();
    $('#create-new-group').on('click', function() {
        $('#new-chat-recipient-list').children().not('#create-new-group').off('click');
        $('#new-chat-search-people').off('input');
        $('#new-group-column').css('display', 'inline-block');
        $('#new-group-column').animate({
            left: '0px'
        });
        addListenerToFindPeopleForGroupChat();
        addSubmissionListenerForNewGroupForm(); // Last form including name of group / image . This listener listens for click on frst as well as second form
    });
});
$('#myProfile_btn').click(function() {
    $('#myProfile-column').css('display', 'inline-block');
    $('#myProfile-column #profile-myname div input').val(displayName);
    $('#myProfile-column').animate({
        left: '0px'
    }, 300, 'swing');
});
$('#back-to-chat-lobby-from-new-chat').click(function() {
    var vw = $('body').width();
    if (vw > 768) {
        $('#new-chat-column').animate({
            left: '-33.333333%'
        }, 300, 'swing', function() {
            $('#new-chat-column').css('display', 'none');
        });
    } else {
        $('#new-chat-column').animate({
            left: '-100%'
        }, 300, 'swing', function() {
            $('#new-chat-column').css('display', 'none');
        });
    }
    $('#new-chat-search-people').off('input');
    $('#create-new-group').off('click');
    $('#new-chat-search-people').val('');
    $('#new-chat-recipient-list').children().not('#create-new-group').remove();
});
$('#back-to-chat-lobby-from-myProfile').click(function() {
    var vw = $('body').width();
    if (vw > 768) {
        $('#myProfile-column').animate({
            left: '-33.333333%'
        }, 300, 'swing', function() {
            $('#myProfile-column').css('display', 'none');
        });
    } else {
        $('#myProfile-column').animate({
            left: '-100%'
        }, 300, 'swing', function() {
            $('#myProfile-column').css('display', 'none');
        });
    }
});
$('#back-to-chat-lobby-from-new-group').click(function() {
    var vw = $('body').width();
    if (vw > 768) {
        $('#new-group-column').animate({
            left: '-33.333333%'
        }, 300, 'swing', function() {
            $('#new-group-column').css('display', 'none');
        });
    } else {
        $('#new-group-column').animate({
            left: '-100%'
        }, 300, 'swing', function() {
            $('#new-group-column').css('display', 'none');
        });
    }
    addListenerToFindPeopleForPersonalChat();
    $('#new-group-search-people').off('input');
    $('#selected-people-for-new-group-btn').off('click');
    $('#selected-people').empty();
    $('#new-group-search-people').val('');
    $('#new-group-recipient-list').empty();
    $('#selected-people-for-new-group-btn').css('display', 'none');
});
$('#back-to-chat-lobby-from-new-group-select-name').click(function() {
    var vw = $('body').width();
    if (vw > 768) {
        $('#new-group-column-select-name').animate({
            left: '-33.333333%'
        }, 300, 'swing', function() {
            $('#new-group-column-select-name').css('display', 'none');
        });
    } else {
        $('#new-group-column-select-name').animate({
            left: '-100%'
        }, 300, 'swing', function() {
            $('#new-group-column-select-name').css('display', 'none');
        });
    }
    $('#new-group-name').val('');
    $('#new-group-img').css('background-image', '');
});
$('#back-to-chat-lobby-from-chat').click(function() {
    $('.messaging-column').animate({
        right: '-100%'
    }, 300, 'swing', function() {
        $('.messaging-column').css('display', 'none');
    });
});
$('#upload-profile-img-btn').on('change drop',function(e) {
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref('profile_img/' + file.name);
    var uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', function(snapshot) {
            var percentageUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            percentageUploaded = Math.floor(percentageUploaded);
            $('#upload-profile-img-progress').parent().addClass('d-inline-block');
            $('#upload-profile-img-progress').css('width', `${percentageUploaded}%`);
            $('#upload-profile-img-progress').text(percentageUploaded + '%');
        },
        function() {
            //errors
        },
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                usersref.doc(email).update({
                    photoURL: downloadURL
                });
                photoURL = downloadURL;
                userInfo.updateProfile({
                    photoURL: downloadURL
                }).then(function() { // Update successful
                    $('#upload-profile-img-progress').parent().removeClass('d-inline-block');
                    $('#myprofile-img').css('background-image', `url('${photoURL}')`);
                });
            });
        });
});


// The next three functions are to for uploading new group image
$('#upload-new-group-img-btn').on('change drop',function(e) {
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref('group_img/' + file.name);
    var uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', function(snapshot) {
            var percentageUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            percentageUploaded = Math.floor(percentageUploaded);
            $('#upload-new-group-img-progress').parent().addClass('d-inline-block');
            $('#upload-new-group-img-progress').css('width', `${percentageUploaded}%`);
            $('#upload-new-group-img-progress').text(percentageUploaded + '%');
        },
        function() {
            //errors
        },
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                $('#upload-new-group-img-progress').parent().removeClass('d-inline-block');
                $('#new-group-img').css('background-image', `url('${downloadURL}')`);
            });
        });
});
$('#upload-new-group-img-by-drag-btn').on('drop',function(e){
	var file = e.target.files[0];
    var storageRef = firebase.storage().ref('group_img/' + file.name);
    var uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', function(snapshot) {
            var percentageUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            percentageUploaded = Math.floor(percentageUploaded);
            $('#upload-new-group-img-progress').parent().addClass('d-inline-block');
            $('#upload-new-group-img-progress').css('width', `${percentageUploaded}%`);
            $('#upload-new-group-img-progress').text(percentageUploaded + '%');
        },
        function() {
            //errors
        },
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                $('#upload-new-group-img-progress').parent().removeClass('d-inline-block');
                $('#new-group-img').css('background-image', `url('${downloadURL}')`);
            });
        });
});
$('#upload-new-group-img-by-drag-btn').on('dragenter',function(){
	var html = "<div style='height: 100%; width: 100%; position: absolute; opacity: 0.9; background-color: #fff; left: 0px; top: 0px; display: flex; padding: 90px 30px 30px 30px'> <div style='border: dashed rgb(66, 133, 244); margin: auto; height: 100%; width: 100%; left: 0px; right: 0px;'>Drag files here</div> </div>";
	$('#new-group-column-select-name').append(html);
});
$('#upload-new-group-img-by-drag-btn').on('dragleave',function(e){
	if (e.originalEvent.pageX != 0 || e.originalEvent.pageY != 0) {
        return false;
    }
	$('#new-group-column-select-name').children().last().remove();
})
$('#logout_btn').click(function() {
    firebase.auth().signOut();
});
function addListenerToFindPeopleForPersonalChat() {
    $('#new-chat-search-people').on('input', function() {
        var database = firebase.firestore();
        var searchKey = $(this).val();
        var range = searchKey.substring(0, searchKey.length - 1) + String.fromCharCode(searchKey.charCodeAt(searchKey.length - 1) + 1);
        database.collection('users').where('email', '>=', searchKey).where('email', '<', range).where('visibleToOthers', '==', true).get().then(function(snapshot) {
            $('#new-chat-recipient-list').children().not('#create-new-group').remove();
            var obj = snapshot.docs;
            obj.forEach(function(contact) {
                contact = contact.data();
                var html = `<div style="overflow: hidden; height: 70px; display: flex;border-bottom: 1px solid rgba(0, 0, 0, 0.1);"> 
                            <div class="background-image-holder" style="height: 50px ;width:50px ;min-height: 50px;min-width: 50px; border-radius: 100%;background-image: url('${contact.photoURL}'); display: inline-block; vertical-align: middle; margin: 10px;">
                            </div> 
                            <div style="width: 100%;">
                                <div style="height: 50%; display: flex;">
                                    <span style="margin: auto 5px 0px;">${contact.email}</span>
                                </div>
                                <span style="font-size: 14px; color: rgba(0, 0, 0, 0.6); margin: 0px 5px">${contact.displayName}</span>
                            </div>
                        </div>`;
                $('#new-chat-recipient-list').append(html);
            });
            addClickListenerToSelectContactForPersonalChat();
        });
    });
}

function addListenerToFindPeopleForGroupChat() {
    $('#new-group-search-people').on('input', function() {
        var database = firebase.firestore();
        var searchKey = $(this).val();
        var range = searchKey.substring(0, searchKey.length - 1) + String.fromCharCode(searchKey.charCodeAt(searchKey.length - 1) + 1);
        database.collection('users').where('email', '>=', searchKey).where('email', '<', range).where('visibleToOthers', '==', true).get().then(function(snapshot) {
            $('#new-group-recipient-list').children().not('#create-new-group').remove();
            var obj = snapshot.docs;
            obj.forEach(function(contact) {
                contact = contact.data();
                var html = `<div style="overflow: hidden; height: 70px; display: flex;border-bottom: 1px solid rgba(0, 0, 0, 0.1);"> 
                            <div class="background-image-holder" style="height: 50px ;width:50px ;min-height: 50px;min-width: 50px; border-radius: 100%;background-image: url('${contact.photoURL}'); display: inline-block; vertical-align: middle; margin: 10px;">
                            </div> 
                            <div style="width: 100%;">
                                <div style="height: 50%; display: flex;">
                                    <span style="margin: auto 5px 0px;">${contact.email}</span>
                                </div>
                                <span style="font-size: 14px; color: rgba(0, 0, 0, 0.6); margin: 0px 5px">${contact.displayName}</span>
                            </div>
                        </div>`;
                $('#new-group-recipient-list').append(html);
            });
            addClickListenerToSelectContactForGroupChat();
        });
    });
}

function addClickListenerToSelectContactForGroupChat() {
    var previousNoOfRecipients;
    $('#new-group-recipient-list').children().on('click', function() {
        var chat_img = $(this).children().first().css('background-image');
        var person_name = $(this).children().eq(1).children().eq(1).text();
        var personEmail = $(this).children().eq(1).children().first().text();
        var html = `<div style='background-color:#e8e8e8; height: 26px; border-radius: 16px; padding-right: 8px; display: inline-flex;'>
		                 <div  class="background-image-holder d-inline-block" style='height: 26px; min-height: 26px; width: 26px; max-width: 26px; background-image: ${chat_img}; border-radius: 100%;'></div>
		                 <div style="font-size: 13px; display: inline-block; padding: 0px 8px; margin: auto">${person_name}</div>
		                 <i class="material-icons removeContactFromNewGroup" style="font-size: 15px; margin: auto 0px auto 8px;background-color: rgba(0, 0, 0, 0.6); color: transparent;height: 15px; width: 15px; color: rgba(0, 0, 0, 0.6); background-color: transparent; border-radius: 100%;">clear</i>
		             </div>`;
        previousNoOfRecipients = $('#selected-people').children().length;
        $('#selected-people').append(html);
        $('#selected-people').children().last().attr('personEmail', personEmail.trim());
        $('#selected-people').children().last().children().last().on('click', function() {
            previousNoOfRecipients = $('#selected-people').children().length;
            $(this).parent().remove();
            if ((previousNoOfRecipients == 1) && ($('#selected-people').children().length == 0)) {
                $('#selected-people-for-new-group-btn').hide(200);
            }
        })
        if (($('#selected-people').children().length == 1) && (previousNoOfRecipients == 0)) {
            $('#selected-people-for-new-group-btn').show(200);
        }
        $('#new-group-search-people').val('')
    });
}

function addSubmissionListenerForNewGroupForm() {
    $('#selected-people-for-new-group-btn').on('click', function() {
        $('#new-group-column-select-name').css('display', 'inline-block');
        $('#new-group-column-select-name').animate({
            left: '0px'
        }, 300, 'swing');
        var participants = [];
        $('#selected-people').children().each(function() {
            participants.push($(this).attr('personEmail'));
        });
        var boolean = false;
        $('#new-group-name').on('input', function() {
            if ($(this).val() != '' && boolean == false) {
                boolean = true;
                $('#new-group-form-filled').show(200);
            } else if ($(this).val() == '') {
                $('#new-group-form-filled').hide(200);
                boolean = false;
            }
        });
        $('#new-group-form-filled').one('click', function() {
            var database = firebase.firestore();
            database.settings({
                timestampsInSnapshots: true
            });
            var chat_img = $('#new-group-img').css('background-image');
            chat_img = chat_img.substring(5, chat_img.length - 2)
            participants.push(email); // My email
            var chat = {
                personalChat: false,
                recipient: participants,
                chatName: $('#new-group-name').val(),
                chatImage: chat_img
            };
            var chatId;
            var ref = database.collection('chats').add(chat).then(function(returnVal) {
                chatId = returnVal.id;
                participants.forEach(function(recipient) {
                    database.collection('users').doc(recipient).update({
                        mychatlist: firebase.firestore.FieldValue.arrayUnion(chatId)
                    });
                });
            });
            var width = '-' + $('#chats-column').width() + 'px';
            $('#new-chat-column, #new-group-column-select-name, #new-group-column').animate({
                left: width
            }, 300, 'swing', function() {
                $('#new-chat-column').css('display', 'none');
            });
            //remove all the listeners set to create new chat
            $('#new-chat-search-people').off('input');
            $('#create-new-group').off('click');
            $('#new-chat-search-people').val('');
            $('#new-chat-recipient-list').children().not('#create-new-group').remove();
            $('#new-group-search-people').off('input');
            $('#selected-people-for-new-group-btn').off('click');
            $('#new-group-name').val('');
            $('#new-group-img').css('background-image', '');
            $('#selected-people').empty();
            $('#new-group-search-people').val('');
            $('#new-group-recipient-list').empty();
            $('#selected-people-for-new-group-btn').css('display', 'none');
        });
    });
}
$('#profile-myname-edit-btn').on('click', function() {
    var addProfileChangeBtnListener = function() {
        var editNameBtn = $('#profile-myname-edit-btn');
        var nameInputRef = $('#myProfile-column #profile-myname div input');
        $(nameInputRef).prop('disabled', false);
        $(nameInputRef).css('border-bottom', 'solid rgb(66, 133, 244)');
        $(editNameBtn).text('done');
        $(editNameBtn).off('click');
        $(editNameBtn).one('click', function() {
            var new_name = $(nameInputRef).val();
            usersref.doc(email).update({
                displayName: new_name
            });
            userInfo.updateProfile({
                displayName: new_name
            });
            displayName = new_name;
            $(editNameBtn).text('mode_edit');
            $(editNameBtn).on('click', addProfileChangeBtnListener)
            $(nameInputRef).prop('disabled', true);
            $(nameInputRef).css('border-bottom', '');
        })
    };
    addProfileChangeBtnListener();
});

function addClickListenerToSelectContactForPersonalChat() {
    $('#new-chat-recipient-list').children().not('#create-new-group').on('click', function() {
        var database = firebase.firestore();
        database.settings({
            timestampsInSnapshots: true
        });
        var recipients = [$(this).children().eq(1).children().first().text().trim()];
        recipients.push(email); // My email
        var chat = {
            personalChat: true,
            recipient: recipients
        };
        var chatId;
        var ref = database.collection('chats').add(chat).then(function(returnVal) {
            chatId = returnVal.id;
            recipients.forEach(function(recipient) {
                database.collection('users').doc(recipient).update({
                    mychatlist: firebase.firestore.FieldValue.arrayUnion(chatId)
                });
            });
            var width = '-' + $('#chats-column').width() + 'px';
            $('#new-chat-column').animate({
                left: width
            }, 300, 'swing', function() {
                $('#new-chat-column').css('display', 'none');
            });
        });
        $('#new-chat-search-people').off('input');
        $('#create-new-group').off('click');
        $('#new-chat-search-people').val('');
        $('#new-chat-recipient-list').children().not('#create-new-group').remove();
    });
}
$(window).resize(function() {
    var vh = $(window).height();
    var height = vh - 397;
    $('#new-group-recipient-list').height(height + 'px');
});
$(window).trigger('resize');

$(function () {
    var hichat = new HiChat();
    hichat.init();
})

var HiChat = function () {
    this.socket = null;
}

HiChat.prototype = {

    init:function () {
        var that = this;//复制一份socket
        var nickname='';
        this.socket = io.connect();
        this.socket.on('connect',function () {
            $('#info1').html("get yourself a nickname:)");
            $('#nickWrapper').css('display','block');
            $('#nicknameInput').focus();
        });

        this.socket.on('nickExisted',function () {
            $('#info1').html('nickname is taken, choose another pls');
        });

        this.socket.on('loginSuccess',function () {
            $('#loginWrapper').css('display','none');
            $('#messageInput').focus();
        });

        this.socket.on('system',function (name,len,type) {
            var msg = name + (type == 'login' ? ' joined' : ' left');
            if(name!=null) that.displaymsg('system',msg,'red');
            $('#status').html('现在有 '+len+' 在线');
        });

        this.socket.on('newMsg',function (user,msg) {
            if(user!=nickname) that.displaymsg(user,msg);
        });

        $('#loginBtn').click(function () {
            nickname = $('#nicknameInput').val();
            if (nickname.trim().length != 0){
                that.socket.emit('login',nickname);
            }else{
                $('#nicknameInput').val('');
                $('#nicknameInput').focus();
            }
        });

        $('#sendBtn').click(function () {
            if ($('#messageInput').val().trim().length!=0){
                that.socket.emit('postMsg',$('#messageInput').val().trim());
                that.displaymsg('me',$('#messageInput').val().trim());
                $('#messageInput').val('');
            }
        });
    },

    displaymsg:function (user,msg,color) {
        var date = new Date().toTimeString().substr(0, 8);
        var newp = document.createElement('p');
        newp.style.color = color || '#000';

        if(user == 'me'){
            $('#historyMsg').append($(newp).html(  user+ '<span class="timespan">(' + date + '): </span>' + msg));
            $(newp).css('text-align','right');
        }else {
            if(user=='system') $(newp).css('text-align','center');
            $('#historyMsg').append($(newp).html(msg+ '<span class="timespan">(' + date + '): </span>' + user ));

        }
    }
}

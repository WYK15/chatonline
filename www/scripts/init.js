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

        this.socket.on('newMsg',function (user,msg,color) {
            if(user!=nickname) that.displaymsg(user,msg,color);
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
                that.socket.emit('postMsg',$('#messageInput').val().trim(),$('#colorStyle')[0].value);
                that.displaymsg('me',$('#messageInput').val().trim(),$('#colorStyle')[0].value);
                $('#messageInput').val('');
            }
        });

        $('#emoji').click(function (e) {
             $('#emojiWrapper').css('display','block');
             e.stopPropagation();
        });

        $('body').click(function (e) {
            if (e.target.id != "emojiWrapper")
            $('#emojiWrapper').css('display','none');
        });


        $('#emojiWrapper').click(function (e) {

            if (e.target.nodeName=='IMG'){
                 $('#messageInput').focus();
                 $('#messageInput').val($('#messageInput').val()+'[emoji:' + e.target.title + ']');
            }
        });

        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that.displayNewMsg('me', msg, color);
            };
        }, false);


    },

    displaymsg:function (user,msg,color) {
        var date = new Date().toTimeString().substr(0, 8);
        var newp = document.createElement('p');
        newp.style.color = color || '#000';
         msg = this.showemoji(msg);
        if(user == 'me'){
            $('#historyMsg').append($(newp).html(  msg+ '<span class="timespan">(' + date + '): </span>' + user));
            $(newp).css('text-align','right');
        }else {
            if(user=='system') $(newp).css('text-align','center');
            $('#historyMsg').append($(newp).html(user+ '<span class="timespan">(' + date + '): </span>' + msg ));

        }
    },

    showemoji:function (msg) {
        var res = msg;
        //处理字符串将[]中的字符串替换为<img>标签
        var re = /\[emoji:\d+\]/g;
        var match,emojiIndex;

        while( match = re.exec(msg)){
            emojiIndex = match[0].slice(7, -1);
            if(emojiIndex <= 40){
                res = res.replace(match[0],'<img class="emoji" src="photos/rabbit/emo' + emojiIndex + '.gif" />');
            }
        }
        return res;
    }
}

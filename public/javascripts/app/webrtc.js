/**
 * @name webrtc
 * @description webrtc模块
 * @module webrtc
 */
define(function (require, exports, module) {
    var $ = require('jQuery');
    var Event = require('../mod/event');
    var event = new Event();
    var globalEvent=require('../mod/globalevent');
    var klass = require('../mod/klass');
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;
    var PeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    /**
     *@alias module:webrtc
     */
    var Webrtc = module.exports = klass(null,
        /**@lends Webrtc.prototype*/
        {
            /**
             * @constructs
             * @param {String} option.websocketServer websocket 地址.e.g ws://ip:port
             * @param {Array} option.iceServers [{url:'stun://ip:port'}]
             */
            __construct: function (option) {
                this.option = option;
                this.stream=null;
                try{
                    this.websocket=new WebSocket(option.websocketServer);
                }
                catch(e){
                    throw e;
                    return;
                }
                this.peerConnections=[];

            },
            _initWebsocketEvent:function(){
                var ws=this.websocket;
                ws.onmessage = function (e) {
                    parse(socket, e.data);
                };
                ws.onerror = function (e) {
                    console.debug(e);
                };
                ws.onclose = function (e) {
                    console.log(e.code + '\n');
                    console.log(e.reason + '\n');
                };
                ws=null;
            },
            displayLocalStream:function(video){
                var self=this;
                navigator.getUesrMedia({
                    video:true,
                    audio:false
                },function(s){
                    self.stream=s;
                    video.setAttribute('autoplay','autoplay');
                    video.src=window.URL.createObjectURL(s);
                },function(){
                    alert('无法捕获到媒体');
                });
            }
        });
    var handleFunction = {
        'sendoffer': function (socket, data) {
            console.log('reveive offer');
            pc.setRemoteDescription(new RTCSessionDescription(data.msg),
                function () {
                    pc.createAnswer(function (answer) {
                        pc.setLocalDescription(
                            answer,
                            function () {
                                send({
                                    action: 'sendanswer',
                                    msg: answer
                                })
                            },
                            function (err) {

                            });
                    }, function (err) {
                        console.log('create answer error');
                    });
                }, function (err) {
                    console.log(err);
                });
        },//data.msg是已序列化的对方offer，因此这里需要创建answer并发送给对方
        'sendanswer': function (socket, data) {
            pc.setRemoteDescription(new RTCSessionDescription(data.msg), function () {
                console.log('receive answer!!');
            }, function (err) {

            });
        },
        'candidate': function (socket, data) {
            pc.addIceCandidate(new RTCIceCandidate(data.msg), function () {
                console.log('iceCandidate success');
            }, function () {
                console.log('iceCandidate fail');
            });
        }
    };
    function parse(data) {
        var _data = JSON.parse(data);
        if (!!_data) {
            handleFunction[_data.action] && handleFunction[_data.action].call(this, _data);
        }
    }

    function send(data) {
        this.socket.send(JSON.stringify(data));
    }
    var stream;
    var ctx = document.querySelector('#canvas').getContext('2d');
    var isCaller = !!location.hash;
    var video = document.getElementById('video');
    var mute = $('#mute'), toggleVideo = $('#togglevideo');


    event.on('localstreamready', function () {
        var pc;
        var count = 0;




        var socket = new WebSocket('ws://192.168.191.1:10000');

        socket.onopen = function (e) {
            console.log('connection setup!');
            try {
                pc = new PeerConnection({
                    iceServers: [{
                        url: 'stun:192.168.191.1:3478'
                    }]
                });
                pc.onicecandidate = function (ev) {
                    ev.candidate && send({
                        action: 'candidate',
                        msg: ev.candidate
                    });
                };
                pc.onaddstream = function (ev) {
                    var remoteVideo = document.createElement('video');
                    remoteVideo.setAttribute('id', 'remotevideo' + count);
                    remoteVideo.setAttribute('autoplay', 'autoplay');
                    document.body.insertBefore(remoteVideo, video);
                    remoteVideo.src = window.URL.createObjectURL(ev.stream);
                    count++;
                };
                pc.onremovestream = function () {
                    var remoteVideo = document.querySelector('#remotevideo');
                    window.URL.revokeObjectURL(remoteVideo.src);
                    document.body.removeChild(document.querySelector('#remotevideo'));
                }
            }
            catch (e) {
                console.log(e);
                console.log('fail to create PeerConnection');
            }

            pc.addStream(stream);

            //pc.onaddstream({stream:stream});
            if (isCaller) {
                pc.createOffer(function (offer) {
                    console.debug(offer);
                    pc.setLocalDescription(offer, function () {
                        send({
                            action: 'sendoffer',
                            msg: offer
                        })
                    }, function (err) {
                        console.log('set local description error');
                    });
                }, function (err) {
                    console.log('create offer error');
                });
            }

        };


    });

    getUserMedia.call(navigator, {video: true, audio: true}, function (s) {
        stream = s;
        video.src = window.URL.createObjectURL(s);
        video.play();
        event.emit('localstreamready');
//        window.URL.revokeObjectURL();
    }, function (err) {
        alert(err);
    });
    document.querySelector('#takePhoto').onclick = function (e) {
        ctx.drawImage(video, 0, 0, 640, 480);
    };
    mute.on('click', function () {
        if (mute[0].getAttribute('_ismuted') == 'false') {
            var audioTrack = stream.getAudioTracks()[0];
            audioTrack.stop();
            stream.removeTrack(audioTrack);
            mute[0].setAttribute('_ismuted', true);
        }
        else {
            getUserMedia.call(navigator, {audio: true},
                function (as) {
                    audioTrack = as.getAudioTracks()[0];
                    stream.addTrack(audioTrack);
                    window.URL.revokeObjectURL(video.src);
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                    mute[0].setAttribute('_ismuted', false);
                }, function (err) {
                    console.log(err)
                });
        }
    });


});

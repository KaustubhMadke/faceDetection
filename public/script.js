const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peers = {}

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    streamMyVideo(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const userVideo = document.createElement('video')
        call.on('stream', userVideoStream => {
            streamMyVideo(userVideo, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId = {
    //if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)    
})

socket.emit('join-room', ROOM_ID, 10)

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const userVideo = document.createElement('video')
    call.on('stream', userVideoStream => {
        streamMyVideo(userVideo, userVideoStream)
    })
    call.on('close', () => {
        userVideo.remove()
    })

    peers[userId] = call
}

function streamMyVideo(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
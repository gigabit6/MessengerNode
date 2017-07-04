module.exports = (messages, req) => {
  for (let message of messages) {
    if ((message.content.startsWith('http') ||
     message.content.startsWith('https')) &&
     (message.content.endsWith('jpg') ||
     message.content.endsWith('jpeg') ||
     message.content.endsWith('png'))) {
      message.content = `<img src="${message.content}">`
    } else {
      message.content = message.content.replace(/((https?)[^\s]+)/gi, '<a  target="_blank" href="$1">$1</a>')
    }
    if (message.user.equals(req.user._id)) {
      message.loggedUser = true
    }
    if (!message.user.equals(req.user._id) && !message.isLiked) {
      message.toBeLiked = true
    }
  }
}

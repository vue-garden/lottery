import $ from 'jquery'

$.fn.extend({
  animateCss: function(animationName) {
    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    return new Promise((resolve) => {
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName)
        resolve($(this))
      })
    })
  }
})

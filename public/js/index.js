$(function () {

      let $loginBox = $('#loginBox'),
          $registerBox = $('#registerBox'),
          $userInfo = $('#userInfo');

      $loginBox.find('.colMint').on('click',function() {
            $registerBox.show();
            $loginBox.hide();
      });

      $registerBox.find('.colMint').on('click',function() {
            $loginBox.show();
            $registerBox.hide();
      });

      /* 注册 */
      $registerBox.find('button').on('click',function() {

            $.ajax({
                  type: 'post',
                  url: '/api/user/register',
                  data: {
                        username: $registerBox.find('[name="username"]').val(),
                        password: $registerBox.find('[name="password"]').val(),
                        repassword: $registerBox.find('[name="repassword"]').val()
                  },
                  dataType: 'json',
                  success(result){
                        $registerBox.find('.colWarning').html(result.message);
                        if (!result.code) {
                              setTimeout(() => {
                                    $loginBox.show(),
                                    $registerBox.hide(),
                                    $loginBox.find('[name="username"]').val(''),
                                    $loginBox.find('[name="password"]').val(''),
                                    $registerBox.find('[name="username"]').val(''),
                                    $registerBox.find('[name="password"]').val(''),
                                    $loginBox.find('.colWarning').html(''),
                                    $registerBox.find('[name="repassword"]').val('');
                              }, 1000)
                        }
                  }
            });
      });

      /* 登录 */
      $loginBox.find('button').on('click',function(){
            $.ajax({
                  type: 'post',
                  url: '/api/user/login',
                  data: {
                        username: $loginBox.find('[name="username"]').val(),
                        password: $loginBox.find('[name="password"]').val()
                  },
                  dataType: 'json',
                  success(result){
                        $loginBox.find('.colWarning').html(result.message);
                        if (!result.code) {
                             window.location.reload();
                        }
                  }
            });
      });

      /* 退出登录 */

      $('#logout').on('click',function(){
             $.ajax({
                 url:'/api/user/logout',
                 success(result){
                       if(!result.code){
                             window.location.reload();
                       }
                 }
             });
      });

});
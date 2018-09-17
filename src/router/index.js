import Vue from 'vue'
import Router from 'vue-router'
import cookie from '@/assets/js/cookie'

// 模块js文件
// import config_ from '@/assets/js/config'

Vue.use(Router)
// -------------------------------------------------------------------
// 登入模块
import Index from '@/pages/index'
// 主布局模块
import Main from '@/pages/main_'
// -------------------------------------------------------------------
// 首页模块
import homePage             from '@/pages/cententPages/homePage'

//录音管理
import soundRecording           from '@/pages/cententPages/soundRecording'
import addressBook         from '@/pages/cententPages/addressBook'




// 微信列表模块
import wechatList           from '@/pages/cententPages/wechatList'
// 微信分组模块
import wechatGrous          from '@/pages/cententPages/wechatGrous'
// 好友列表模块
import friendsList          from '@/pages/cententPages/friendsList'
// 好友分组模块
import friendsGrous         from '@/pages/cententPages/friendsGrous'
// 客服列表
import serviceList         from '@/pages/cententPages/serviceList'
// 客服分组
import serviceGroup         from '@/pages/cententPages/serviceGroup'
// 分配规则模块
import allocation           from '@/pages/cententPages/allocation'
// 分配记录模块
import distribution         from '@/pages/cententPages/distribution'
// 设备列表模块
import equipmentList        from '@/pages/cententPages/equipmentList'
// 设备分组模块
import equipmentGrous       from '@/pages/cententPages/equipmentGrous'
// 敏感词设置模块
import sensitiveSet         from '@/pages/cententPages/sensitiveSet'
// 敏感词分组模块
import sensitiveGrous       from '@/pages/cententPages/sensitiveGrous'
// 敏感词操作模块
import sensitiveOperations  from '@/pages/cententPages/sensitiveOperations'
// 重复好友统计模块
import repeatFriends        from '@/pages/cententPages/repeatFriends'
// 微信财务统计模块
import wechatFinancial      from '@/pages/cententPages/wechatFinancial'
// 部门管理模块
import department           from '@/pages/cententPages/department'
// 角色管理模块
import account              from '@/pages/cententPages/account'
// 公司管理模块
import management           from '@/pages/cententPages/management'
// 手机加好友模块
import addFriends           from '@/pages/cententPages/addFriends'
// 发送朋友圈模块
import hairFriends_f        from '@/pages/cententPages/hairFriends_f'
// 朋友圈记录模块
import hairFriends          from '@/pages/cententPages/hairFriends'
// 浅度养号模块
import shallowRaise         from '@/pages/cententPages/shallowRaise'
// 养号操作记录模块
import recordNumber         from '@/pages/cententPages/recordNumber'
// 清理僵尸粉模块
import dustZombies          from '@/pages/cententPages/dustZombies'
// 更新日志模块
import updateLog            from '@/pages/cententPages/updateLog'
// 操作记录模块
import operationRecords     from '@/pages/cententPages/operationRecords'
// -------------------------------------------------------------------
// 好友统计子模块
import friendsStatistical       from '@/pages/cententPages/homeModules/friendsStatistical'
// 敏感操作统计子模块
import sensitiveStatistical     from '@/pages/cententPages/homeModules/sensitiveStatistical'
// 好友增长统计子模块
import growthStatistical        from '@/pages/cententPages/homeModules/growthStatistical'
// 好友增长排行子模块
import growthRanking            from '@/pages/cententPages/homeModules/growthRanking'
// 好友分配统计子模块
import distributionStatistical  from '@/pages/cententPages/homeModules/distributionStatistical'
// 接待人数统计子模块
import receptionStatistical     from '@/pages/cententPages/homeModules/receptionStatistical'
// 客服对话统计子模块
import dialogueStatistical      from '@/pages/cententPages/homeModules/dialogueStatistical'
// 好友未通过统计子模块
import throughStatistical       from '@/pages/cententPages/homeModules/throughStatistical'

// 路由配置
const router = new Router({
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path:'/main',
      component:Main,
      children:[
        {
          path:'/main/homePage',
          component:homePage,
          children:[
            {
              path: '/main/homePage/friendsStatistical',
              component: friendsStatistical
            },
            {
              path: '/main/homePage/sensitiveStatistical',
              component: sensitiveStatistical
            },
            {
              path: '/main/homePage/growthStatistical',
              component: growthStatistical
            },
            {
              path: '/main/homePage/growthRanking',
              component: growthRanking
            },
            {
              path: '/main/homePage/distributionStatistical',
              component: distributionStatistical
            },
            {
              path: '/main/homePage/receptionStatistical',
              component: receptionStatistical
            },
            {
              path: '/main/homePage/dialogueStatistical',
              component: dialogueStatistical
            },
            {
              path: '/main/homePage/throughStatistical',
              component: throughStatistical
            },
          ]
        },
        {
          path:'/main/wechatList',
          component:wechatList,
        },
        {//录音管理
          path:'/main/soundRecording',
          component:soundRecording,
        },
        {//录音管理
          path:'/main/addressBook',
          component:addressBook,
        },
        {
          path:'/main/wechatGrous',
          component:wechatGrous,
        },
        {
          path:'/main/friendsList',
          component:friendsList,
        },
        {
          path:'/main/friendsGrous',
          component:friendsGrous,
        },
        {
          path:'/main/serviceList',
          component:serviceList,
        },
        {
          path:'/main/serviceGroup',
          component:serviceGroup,
        },
        {
          path:'/main/allocation',
          component:allocation,
        },
        {
          path:'/main/distribution',
          component:distribution,
        },
        {
          path:'/main/equipmentList',
          component:equipmentList,
        },
        {
          path:'/main/equipmentGrous',
          component:equipmentGrous,
        },
        {
          path:'/main/sensitiveSet',
          component:sensitiveSet,
        },
        {
          path:'/main/sensitiveGrous',
          component:sensitiveGrous,
        },
        {
          path:'/main/sensitiveOperations',
          component:sensitiveOperations,
        },
        {
          path:'/main/repeatFriends',
          component:repeatFriends,
        },
        {
          path:'/main/wechatFinancial',
          component:wechatFinancial,
        },
        {
          path:'/main/department',
          component:department,
        },
        {
          path:'/main/account',
          component:account,
        },
        {
          path:'/main/management',
          component:management,
        },
        {
          path:'/main/addFriends',
          component:addFriends,
        },
        {
          path:'/main/hairFriends_f',
          component:hairFriends_f,
        },
        {
          path:'/main/hairFriends',
          component:hairFriends,
        },
        {
          path:'/main/shallowRaise',
          component:shallowRaise,
        },
        {
          path:'/main/recordNumber',
          component:recordNumber,
        },
        {
          path:'/main/dustZombies',
          component:dustZombies,
        },
        {
          path:'/main/updateLog',
          component:updateLog,
        },
        {
          path:'/main/operationRecords',
          component:operationRecords,
        }
      ]
    }
  ]
});

var nextRoute=[];
// 全局路由守卫
router.beforeEach((to, from, next) => {

  // 登入状态
  if(cookie.getCookie('userKey') == null && to.path !== '/'){
    router.push({ path:'/' });
    next();
  };
  
  var bool_ = 
      nextRoute.length==0 &&                //路由数组为空
      localStorage.getItem(`userId`) &&     //用户id不能为空
      to.path !== '/';                      //首页不执行

  if(bool_){
    // 创建indexedDB本地存储数据表
    window.indexedDBopt = indexedDBoptFun
    (localStorage.getItem(`userId`),1,[
      {name:'userData',keyPath:'type'}			//用户信息
    ]);
    // 获取导航数组
    indexedDBopt.getData('userData','navArr',function(data){
      if(data && data!=undefined){ nextRoute=data.val;
        nextRoute.push('soundRecording');
         };
      guards();
    });
  }else{  
    if(to.path !== '/'){  guards();  };
  };

  // 当前激将进入导航路由
  function guards(){
    var navArr=to.path.split("/");
    var str = navArr[navArr.indexOf("main")+1];
    var bool_ = nextRoute.indexOf(  str  );

    // config_.setRouterStr(str);
    
    if(bool_ < 0){  router.push({ path:'/' }) };
    next();
  };
  
  // 即将退出
  // from.path;

  if(to.path === '/'){next()};
  
});


export default  router;

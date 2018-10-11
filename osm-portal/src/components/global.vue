<script>

const success = '00000' ; //访问成功
const notToken ='01009';  // 缺少token
const TokenInv ='00007'; // token失效
const paramEerror ='00013' ;//参数格式不正确
const sysmBaseUrl = 'http://localhost:8013/sysm/secure';
const loginBaseUrl = 'http://localhost:8014/auth';

export default {
    success,
    notToken,
    TokenInv,
    paramEerror,
    sysmBaseUrl,
    loginBaseUrl
}
</script>

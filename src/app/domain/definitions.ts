export const enum DlgMode {Add=1,Edit,View};
export const AuthorizationInfo = [
  { value: 'hpAdmin', display: '医院管理员', authorizedRes:['doctor','hospital'] },
  { value: 'pfAdmin', display: '平台管理员', authorizedRes:['hospital','doctor','patient','editortype','editor','item','itemdetails','sysinfo','apiwebtester','logviewer','serviceitem','article','disease'] },
  { value: 'root', display: '超级管理员', authorizedRes:['all'] }
];

export const DoctorDict = {
	doctor:'医生',
	nurse:'护士'
};

export const DoctorSource = {
  reg:'注册',
  web:'导入'
};

export const GenderDict = {
	0:'男',
	1:'女'
}

export const StatusSource = {
  0:'审核未申请',
  1:'审核申请',
  2:'审核通过',
  3:'审核拒绝'
};

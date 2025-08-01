
interface RegistrationFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
}

const registerUser = async (
  userData: RegistrationFormData
): Promise<RegistrationResponse> => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '注册失败');
  }

  return response.json();
};

export const RegistrationForm = () => {
 
  // 5. 表单提交处理函数
  const onSubmit = (data: RegistrationFormData) => {
    console.log('准备提交注册数据:', data);

    // 移除确认密码字段（后端通常不需要）
    const { confirmPassword, ...submitData } = data;

    // 触发 mutation
    registerMutation.mutate(submitData);
  };

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: data => {
      // 注册成功的处理
      console.log('注册成功:', data);
      alert('注册成功！欢迎加入！');

      // 可以跳转到其他页面
      // navigate('/login');
      // 或者跳转到欢迎页面
      // navigate('/welcome');
    },
    onError: (error: Error) => {
      // 注册失败的处理
      console.error('注册失败:', error.message);

      // 处理服务器端验证错误
      if (error.message.includes('用户名已存在')) {
        setError('username', {
          type: 'server',
          message: '用户名已存在，请选择其他用户名',
        });
      } else if (error.message.includes('邮箱已被使用')) {
        setError('email', {
          type: 'server',
          message: '该邮箱已被注册，请使用其他邮箱',
        });
      } else {
        // 通用错误提示
        alert(`注册失败: ${error.message}`);
      }
    },
  });
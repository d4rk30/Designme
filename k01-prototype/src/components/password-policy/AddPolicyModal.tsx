import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, TimePicker, Checkbox, Space, Row, Col } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';

interface AddPolicyModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
  mode?: 'add' | 'edit';
}

const { Option } = Select;
const { RangePicker } = TimePicker;
const { TextArea } = Input;

const AddPolicyModal: React.FC<AddPolicyModalProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  mode = 'add'
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      // 如果有时间数据，转换为dayjs对象
      const formValues = {
        ...initialValues,
        effectiveTime: initialValues.effectiveTime ? [
          dayjs(initialValues.effectiveTime[0], 'HH:mm'),
          dayjs(initialValues.effectiveTime[1], 'HH:mm')
        ] : undefined
      };
      form.setFieldsValue(formValues);
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 转换时间格式
      if (values.effectiveTime) {
        values.effectiveTime = values.effectiveTime.map((time: any) => time.format('HH:mm'));
      }
      onOk(values);
      form.resetFields();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const assetGroupOptions = [
    { label: '所有资产', value: 'all' },
    { label: '测试服务器组', value: 'test' },
    { label: '开发服务器组', value: 'dev' },
    { label: '生产服务器组', value: 'prod' },
  ];

  const detectionLevelOptions = [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' },
  ];

  const actionOptions = [
    { label: '阻断', value: 'block' },
    { label: '监控', value: 'monitor' },
  ];

  const weekOptions = [
    { label: '周一', value: 'MON' },
    { label: '周二', value: 'TUE' },
    { label: '周三', value: 'WED' },
    { label: '周四', value: 'THU' },
    { label: '周五', value: 'FRI' },
    { label: '周六', value: 'SAT' },
    { label: '周日', value: 'SUN' },
  ];

  return (
    <Modal
      title={mode === 'add' ? "添加策略" : "编辑策略"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
      width={600}
      className="policy-modal"
      destroyOnClose
    >
      <style>
        {`
          .policy-modal .ant-modal-header {
            margin-bottom: 16px !important;
          }
        `}
      </style>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          passwordFields: 'password|passwd|pwd',
          weekDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        }}
        preserve={false}
      >
        <Form.Item
          name="policyName"
          label="策略名称"
          rules={[{ required: true, message: '请输入策略名称' }]}
        >
          <Input placeholder="请输入策略名称" />
        </Form.Item>

        <Form.Item
          name="assetGroup"
          label="资产分组"
        >
          <Select placeholder="请选择资产分组">
            {assetGroupOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="passwordFields"
          label="密码字段名称"
          rules={[{ required: true, message: '请输入密码字段名称' }]}
        >
          <TextArea
            placeholder="请输入密码字段名称，多个字段用|分隔"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="detectionLevel"
          label="检测级别"
          rules={[{ required: true, message: '请选择检测级别' }]}
        >
          <Select placeholder="请选择检测级别">
            {detectionLevelOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="action"
          label="处理动作"
          rules={[{ required: true, message: '请选择处理动作' }]}
        >
          <Select placeholder="请选择处理动作">
            {actionOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="生效时间" required>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              name="effectiveTime"
              rules={[{ required: true, message: '请选择生效时间段' }]}
              style={{ marginBottom: 0 }}
            >
              <RangePicker
                format="HH:mm"
                picker="time"
                placeholder={['开始时间', '结束时间']}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="weekDays"
              rules={[{ required: true, message: '请选择生效日期' }]}
              style={{ marginBottom: 0 }}
            >
              <Checkbox.Group style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                {weekOptions.map(option => (
                  <Checkbox key={option.value} value={option.value}>
                    {option.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item name="description" label="备注">
          <TextArea
            placeholder="请输入备注信息"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPolicyModal;

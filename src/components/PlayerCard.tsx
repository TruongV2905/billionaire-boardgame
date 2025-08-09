import React from "react";
import type { Player } from "../types/player";
import { Button, Form, InputNumber, Modal, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  addMoney,
  subtractMoney,
  transferMoney,
} from "../redux/features/playersSlice";

interface PlayerCardProps {
  player: Player;
}

interface ModalProps {
  open: boolean;
  onCancel: () => void;
  player: Player;
}

const AddMoneyModal: React.FC<ModalProps> = ({ open, onCancel, player }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const players: Player[] = useSelector((state: any) => state.players);
  const otherPlayers = players.filter((p) => p.id !== player.id);

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        id: player.id,
        money: 0,
        idFrom: "bank",
      });
    }
  }, [open, player.id, form]);

  const handleFinish = (values: {
    money: number;
    idFrom?: number | "bank";
  }) => {
    if (values.idFrom === "bank") {
      dispatch(addMoney({ id: player.id, amount: values.money }));
    } else {
      dispatch(
        transferMoney({
          fromId: values.idFrom as number,
          toId: player.id,
          amount: values.money,
        })
      );
    }
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={`Cộng tiền cho ${player.name}`}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="id" hidden>
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="money"
          label="Số tiền"
          rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
        >
          <InputNumber
            min={0}
            max={5000}
            step={10}
            // Dòng này chịu trách nhiệm thêm dấu phẩy vào số để hiển thị
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            // Dòng này chịu trách nhiệm xóa dấu phẩy đi khi xử lý giá trị
            parser={(value) => value!.replace(/,/g, "")}
            controls={true}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="idFrom"
          label="Nhận tiền từ"
          rules={[{ required: true, message: "Vui lòng chọn một nguồn" }]}
        >
          <Select placeholder="Chọn nguồn">
            <Select.Option value="bank">🏦 Ngân hàng</Select.Option>
            {otherPlayers.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SubtractMoneyModal: React.FC<ModalProps> = ({
  open,
  onCancel,
  player,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        id: player.id,
        money: 0,
      });
    }
  }, [open, player.id, form]);

  const handleFinish = (values: { money: number }) => {
    dispatch(subtractMoney({ id: player.id, amount: values.money }));
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={`Trừ tiền của ${player.name}`}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="id" hidden>
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="money"
          label="Số tiền"
          rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
        >
          <InputNumber
            min={0}
            max={5000}
            step={10}
            // Dòng này chịu trách nhiệm thêm dấu phẩy vào số để hiển thị
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            // Dòng này chịu trách nhiệm xóa dấu phẩy đi khi xử lý giá trị
            parser={(value) => value!.replace(/,/g, "")}
            controls={true}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isSubtractOpen, setIsSubtractOpen] = React.useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-col md:flex-row items-center text-center md:text-left border-2 border-gray-200 rounded-2xl shadow-lg p-4 bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-4 ring-4 ring-blue-400 ring-offset-2 transition duration-300 hover:ring-offset-4 flex-shrink-0">
          <img
            src="https://demoda.vn/wp-content/uploads/2023/06/avatar-anime-anh-dai-dien-anime-nam-ngau.jpg"
            alt={`${player?.name}'s avatar`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">
            {player?.name}
          </h2>
          <p className="text-lg text-green-600 font-extrabold">
            💰 {player?.money?.toLocaleString()}$
          </p>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600 mt-1 inline-block">
            Số đất: {player?.lands?.length}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            + Tiền
          </button>

          <button
            onClick={() => setIsSubtractOpen(true)}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
            - Tiền
          </button>

          <button
            onClick={() => dispatch(addMoney({ id: player.id, amount: 2000 }))}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            🚀 Khởi hành
          </button>
        </div>
      </div>

      <AddMoneyModal
        open={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        player={player}
      />
      <SubtractMoneyModal
        open={isSubtractOpen}
        onCancel={() => setIsSubtractOpen(false)}
        player={player}
      />
    </>
  );
};

export default PlayerCard;

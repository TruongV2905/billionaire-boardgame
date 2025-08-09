import React from "react";
import type { Player } from "../types/player";
import { Button, Form, InputNumber, Modal, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  addMoney,
  removePlayer,
  subtractMoney,
  transferAllToOne,
  transferMoney,
} from "../redux/features/playersSlice";
import Swal from "sweetalert2";

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
    idFrom?: number | "bank" | "all";
  }) => {
    if (values.idFrom === "bank") {
      // Cộng tiền từ ngân hàng
      dispatch(addMoney({ id: player.id, amount: values.money }));
    } else if (values.idFrom === "all") {
      // Trừ tiền tất cả người chơi khác, cộng tổng cho người nhận
      dispatch(
        transferAllToOne({ toId: player.id, amountPerPlayer: values.money })
      );
    } else {
      // Chuyển tiền từ người chơi khác
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
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value: any) => value!.replace(/,/g, "")}
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
            <Select.Option value="all">Tất cả</Select.Option>
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
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value: any) => value!.replace(/,/g, "")}
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
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: `Bạn có chắc muốn phá sản người chơi ${player.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Có, phá sản!",
                cancelButtonText: "Hủy",
              });

              if (result.isConfirmed) {
                dispatch(removePlayer({ id: player.id }));
                Swal.fire(
                  "Đã phá sản!",
                  `${player.name} đã bị loại khỏi trò chơi.`,
                  "success"
                );
              }
            }}
            className="w-full px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75"
          >
            💥 Phá sản
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

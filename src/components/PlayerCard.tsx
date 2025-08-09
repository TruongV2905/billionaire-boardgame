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

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubtractModalOpen, setIsSubtractModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const players: Player[] = useSelector((state: any) => state.players);

  const openModal = (type: "add" | "subtract") => {
    form.resetFields();
    form.setFieldValue("id", player.id);
    if (type === "add") {
      setIsOpen(true);
    } else {
      setIsSubtractModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsSubtractModalOpen(false);
    form.resetFields();
  };

  const handleFinish = (values: {
    money: number;
    idFrom?: number | "bank";
  }) => {
    console.log(values);
    if (isOpen) {
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
    } else if (isSubtractModalOpen) {
      dispatch(subtractMoney({ id: player.id, amount: values.money }));
    }

    handleCancel();
  };

  const otherPlayers = players?.filter((p) => p.id !== player.id);

  const renderModalContent = (title: string) => (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item hidden name="id">
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="money"
        label="Số tiền"
        rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          step={10000}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value: any) => value!.replace(/\$\s?|(,*)/g, "")}
          min={0}
        />
      </Form.Item>

      {title.includes("Cộng") ? (
        <Form.Item
          name="idFrom"
          label={title.includes("Cộng") ? "Nhận tiền từ" : "Chuyển tiền cho"}
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
      ) : (
        <></>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );

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
            onClick={() => openModal("add")}
            className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            + Tiền
          </button>

          <button
            onClick={() => openModal("subtract")}
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

      <Modal
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        title={`Cộng tiền cho ${player.name}`}
      >
        {renderModalContent(`Cộng tiền cho ${player.name}`)}
      </Modal>

      <Modal
        open={isSubtractModalOpen}
        onCancel={handleCancel}
        footer={null}
        title={`Trừ tiền của ${player.name}`}
      >
        {renderModalContent(`Trừ tiền của ${player.name}`)}
      </Modal>
    </>
  );
};

export default PlayerCard;

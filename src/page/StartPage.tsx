import { Button, Form, InputNumber, Modal, Input } from "antd";
import React, { useState } from "react";
import { setPlayers, type Player } from "../redux/features/playersSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface FormValues {
  player: number;
  money: number;
}

function StartPage() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [startingMoney, setStartingMoney] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState("");

  const handleFinish = (values: FormValues) => {
    setPlayerCount(values.player);
    setStartingMoney(values.money);
    setNames([]);
    setCurrentIndex(0);
    setCurrentName("");
    setModalVisible(true);
  };

  const handleNext = () => {
    if (!currentName.trim()) return;
    const updatedNames = [...names, currentName.trim()];
    setNames(updatedNames);

    if (updatedNames.length === playerCount) {
      // Đã nhập đủ
      const playersArr: Player[] = updatedNames.map((name, index) => ({
        id: index + 1,
        name,
        money: startingMoney,
        lands: [],
      }));

      dispatch(setPlayers(playersArr));
      setModalVisible(false);
      nav("/playing");
    } else {
      // Tiếp tục nhập cho player tiếp theo
      setCurrentIndex(currentIndex + 1);
      setCurrentName("");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mx-auto px-5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-7 text-center">
          Start Game
        </h1>

        <Form
          onFinish={handleFinish}
          layout="vertical"
          className="w-full max-w-md mx-auto mt-10"
          style={{ textAlign: "center" }}
          initialValues={{
            player: 4,
            money: 3000,
          }}
        >
          <Form.Item name="player" label="Player count">
            <InputNumber style={{ width: "100%" }} step={1} min={2} max={5} />
          </Form.Item>

          <Form.Item name="money" label="Starting money">
            <InputNumber style={{ width: "100%" }} step={10} />
          </Form.Item>
          <Form.Item>
            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              Start game
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        open={modalVisible}
        title={`Enter name for Player ${currentIndex + 1}`}
        okText={currentIndex + 1 === playerCount ? "Finish" : "Next"}
        onOk={handleNext}
        onCancel={() => setModalVisible(false)}
      >
        <Input
          placeholder={`Player ${currentIndex + 1} name`}
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          onPressEnter={handleNext}
        />
      </Modal>
    </>
  );
}

export default StartPage;

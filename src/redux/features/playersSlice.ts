import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Player } from "../../types/player";
import Swal from "sweetalert2";

const initialState: Player[] = [];

const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    setPlayers: (_state, action: PayloadAction<Player[]>) => {
      return action.payload;
    },
    updatePlayerMoney: (
      state,
      action: PayloadAction<{ id: number; money: number }>
    ) => {
      const { id, money } = action.payload;
      const player = state.find((p) => p.id === id);
      if (player) {
        player.money = money;
      }
    },
    addMoney: (
      state,
      action: PayloadAction<{ id: number; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      const player = state.find((p) => p.id === id);
      if (player) {
        player.money += amount;
      }
    },
    subtractMoney: (
      state,
      action: PayloadAction<{ id: number; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      const player = state.find((p) => p.id === id);
      if (!player) return;

      if (player.money < amount) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Không đủ tiền hãy cầm cố dất hoặc bán đất!",
        });
        return;
      }

      player.money -= amount;
    },
    transferMoney: (
      state,
      action: PayloadAction<{ fromId: number; toId: number; amount: number }>
    ) => {
      const { fromId, toId, amount } = action.payload;
      const fromPlayer = state.find((p) => p.id === fromId);
      const toPlayer = state.find((p) => p.id === toId);

      if (!fromPlayer || !toPlayer) return;
      if (fromPlayer.money < amount) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Không đủ tiền dể chuyển!",
        });
        return;
      }

      fromPlayer.money -= amount;
      toPlayer.money += amount;
    },

    transferAllToOne: (
      state,
      action: PayloadAction<{ toId: number; amountPerPlayer: number }>
    ) => {
      const { toId, amountPerPlayer } = action.payload;
      const toPlayer = state.find((p) => p.id === toId);
      if (!toPlayer) return;

      // Lưu tên những người không đủ tiền để hiển thị 1 lần
      const notEnoughPlayers: string[] = [];

      state.forEach((player) => {
        if (player.id !== toId) {
          if (player.money < amountPerPlayer) {
            notEnoughPlayers.push(player.name);
          } else {
            player.money -= amountPerPlayer;
            toPlayer.money += amountPerPlayer;
          }
        }
      });

      if (notEnoughPlayers.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Một số người không đủ tiền",
          html: `Không chuyển được tiền từ: <b>${notEnoughPlayers.join(
            ", "
          )}</b>`,
        });
      }
    },
    removePlayer: (state, action: PayloadAction<{ id: number }>) => {
      const idToRemove = action.payload.id;
      return state.filter((player) => player.id !== idToRemove);
    },
  },
});

export const {
  setPlayers,
  updatePlayerMoney,
  addMoney,
  subtractMoney,
  transferMoney,
  removePlayer,
  transferAllToOne, // nhớ export reducer mới thêm
} = playersSlice.actions;
export default playersSlice.reducer;

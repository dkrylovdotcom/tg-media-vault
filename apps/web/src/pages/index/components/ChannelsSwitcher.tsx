import { Chip, Stack } from "@mui/material";

interface Props {
  users: [number, string][];
  selectedUserId?: number;
  setSelectedUser: (id?: number) => void;
}

export const ChannelsSwitcher = (props: Props) => {
  const { users, selectedUserId, setSelectedUser } = props;

  return (
    <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" mb={3}>
      {users.map(([id, name]) => (
        <Chip
          key={id}
          label={name}
          clickable
          color={selectedUserId === id ? "primary" : "default"}
          onClick={() => setSelectedUser(selectedUserId === id ? void 0 : id)}
        />
      ))}
    </Stack>
  );
};

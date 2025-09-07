import { Card, CardActionArea, CardMedia, ImageList, ImageListItem, CardContent, Typography } from "@mui/material";
import { ContentItemEntity } from "../../../api/entities/ContentItemEntity";
import { API_URL } from "../../../consts";

interface Props {
  items: ContentItemEntity[];
  handleOpen: (index: number) => void;
}

export const Gallery: React.FC<Props> = (props) => {
  const { items, handleOpen } = props;

  return (
    <ImageList variant="masonry" cols={5} gap={8}>
      {items.map((item, index) => {
        const fileUrl = new URL(item.filePath, API_URL);

        return (
          <ImageListItem key={item.id}>
            <Card elevation={4} sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={() => handleOpen(index)}>
                <CardMedia
                  component={item.isImage() ? 'img' : 'video'}
                  image={fileUrl.toString()}
                  alt={item.getTitle()}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Uploaded: {item.getUploadDate()} by {item.getUsername()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

from fastapi import FastAPI
from typing import Union
from simpletransformers.classification import ClassificationModel
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import multiprocessing

movies_df = pd.read_csv("wiki_movie_plots_deduped.csv")
movies_df = movies_df[(movies_df["Origin/Ethnicity"] == "American")
                      | (movies_df["Origin/Ethnicity"] == "British")]
movies_df = movies_df[["Plot", "Genre"]]
drop_indices = movies_df[movies_df["Genre"] == "unknown"].index
movies_df.drop(drop_indices, inplace=True)
# Combine genres: 1) "sci-fi" with "science fiction" &  2) "romantic comedy" with "romance"
movies_df["Genre"].replace(
    {"sci-fi": "science fiction", "romantic comedy": "romance"}, inplace=True)
# Choosing movie genres based on their frequency
shortlisted_genres = movies_df["Genre"].value_counts().reset_index(
    name="count").query("count > 200")["index"].tolist()
movies_df = movies_df[movies_df["Genre"].isin(
    shortlisted_genres)].reset_index(drop=True)

# Shuffle DataFrame
movies_df = movies_df.sample(frac=1).reset_index(drop=True)

# Sample roughly equal number of movie plots from different genres (to reduce class imbalance issues)
movies_df = movies_df.groupby("Genre").head(400).reset_index(drop=True)

label_encoder = LabelEncoder()
movies_df["genre_encoded"] = label_encoder.fit_transform(
    movies_df["Genre"].tolist())

app = FastAPI()

model = ClassificationModel('bert', 'outputs/', use_cuda=False)


@app.post("/")
def read_root(text: str):
    predicted_genre_encoded, raw_outputs = model.predict([text])
    predicted_genre_encoded = np.array(predicted_genre_encoded)
    predicted_genre = label_encoder.inverse_transform(
        predicted_genre_encoded)
    # print(f'\nTrue Genre:'.ljust(16, ' '), f'{true_genre}\n')
    print(f'Predicted Genre: {predicted_genre}\n')
    print(f'Plot: {text}\n')
    print("-------------------------------------------")

    return {"plot": text, "genre": predicted_genre[0]}

# def main():
#     text = "Just prior to the North Korean invasion"
#     predicted_genre_encoded, raw_outputs = model.predict([text])
#     predicted_genre_encoded = np.array(predicted_genre_encoded)
#     predicted_genre = label_encoder.inverse_transform(
#         predicted_genre_encoded)
#     # print(f'\nTrue Genre:'.ljust(16, ' '), f'{true_genre}\n')
#     print(f'Predicted Genre: {predicted_genre}\n')
#     print(f'Plot: {text}\n')
#     print("-------------------------------------------")


# if __name__ == '__main__':
#     multiprocessing.freeze_support()
#     main()

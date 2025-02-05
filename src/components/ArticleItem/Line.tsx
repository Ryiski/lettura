import React, { ForwardedRef, useEffect, useState } from "react";
import classnames from "classnames";
import Dayjs from "dayjs";
import { useBearStore } from "@/stores";
import { getChannelFavicon } from "@/helpers/parseXML";

export const ArticleLineItem = (props: any) => {
  const { article } = props;
  const store = useBearStore((state) => ({
    updateArticleAndIdx: state.updateArticleAndIdx,
    article: state.article,
    setArticleDialogViewStatus: state.setArticleDialogViewStatus,
  }));
  const [highlight, setHighlight] = useState<boolean>();
  const [readStatus, setReadStatus] = useState(article.read_status);

  const updateCurrentArticle = (article: any) => {
    if (article.read_status === 1) {
      setReadStatus(2);
    }

    store.updateArticleAndIdx(article);
  };

  const handleClick = async (e: React.MouseEvent) => {
    store.setArticleDialogViewStatus(true);

    updateCurrentArticle(article);
  };

  const ico = getChannelFavicon(article.feed_url);

  useEffect(() => {
    setReadStatus(article.read_status);
  }, [article.read_status]);

  useEffect(() => {
    setHighlight(store.article?.id === article.id);
  }, [store.article, article]);

  return (
    <li
      className={classnames(
        "grid grid-cols-[30px_1fr_120px] items-center list-none rounded-sm p-2 pl-6 relative",
        "group hover:bg-accent hover:cursor-pointer",
        {
          "text-[hsl(var(--foreground)_/_80%)]": readStatus === 2,
          "bg-primary": highlight,
        },
      )}
      onClick={handleClick}
      id={article.uuid}
    >
      {readStatus === 1 && (
        <div className="absolute left-2 top-50% mt-[-1] w-2 h-2 rounded-full bg-primary" />
      )}
      <img src={ico} alt="" className="rounded w-4 mr-1" />
      <div className="line-clamp-1">
        <span
          className={classnames(
            `${
              highlight
                ? "text-article-active-headline"
                : "text-article-headline"
            }`,
            "font-bold text-sm group-hover:text-article-active-headline",
          )}
        >
          {article.title}
        </span>
        <span
          className={classnames(
            "text-xs",
            "text-article-paragraph group-hover:text-article-active-paragraph",
            {
              "text-article-active-paragraph": highlight,
            },
          )}
        >
          {(article.description || "").replace(/<[^<>]+>/g, "")}
        </span>
      </div>
      <div
        className={classnames(
          "flex justify-end items-center text-xs text-article-paragraph group-hover:text-article-active-paragraph",
          {
            "text-article-active-paragraph": highlight,
          },
        )}
      >
        <div>
          {Dayjs(article.pub_date || article.create_date).format(
            "YYYY-MM-DD HH:mm",
          )}
        </div>
      </div>
    </li>
  );
};

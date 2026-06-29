import { type Article } from "@lib/blog/get-articles";
import { ArticleCard } from "@components/blog/ArticleCard";

type ArticleGridProps = {
  articles: Article[];
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-base">
          No articles found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

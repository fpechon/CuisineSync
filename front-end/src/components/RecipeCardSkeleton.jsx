function RecipeCardSkeleton() {
  return (
    <div className="recipe-card recipe-card-skeleton">
      <div className="skeleton-banner" />
      <div className="recipe-card-body">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-short" />
        <div className="skeleton-meta">
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
        </div>
      </div>
      <div className="skeleton-btn" />
    </div>
  );
}

export default RecipeCardSkeleton;

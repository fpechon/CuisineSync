from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_recipe_owner'),
    ]

    operations = [
        # 1. Créer la table intermédiaire explicite
        migrations.CreateModel(
            name='MealPlanRecipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('servings', models.PositiveSmallIntegerField(default=1)),
                ('meal_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meal_plan_recipes', to='recipes.mealplan')),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meal_plan_recipes', to='recipes.recipe')),
            ],
            options={
                'ordering': ['recipe__name'],
                'unique_together': {('meal_plan', 'recipe')},
            },
        ),
        # 2. Django ne peut pas altérer un M2M pour ajouter through= via une
        #    opération standard. SeparateDatabaseAndState :
        #    - state : Django sait que MealPlan.recipes utilise through=MealPlanRecipe
        #    - database : supprime l'ancienne table implicite (données panier perdues,
        #      acceptable en dev)
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AlterField(
                    model_name='mealplan',
                    name='recipes',
                    field=models.ManyToManyField(
                        blank=True,
                        related_name='meal_plans',
                        through='recipes.MealPlanRecipe',
                        to='recipes.recipe',
                    ),
                ),
            ],
            database_operations=[
                migrations.RunSQL(
                    sql='DROP TABLE IF EXISTS recipes_mealplan_recipes;',
                    reverse_sql=migrations.RunSQL.noop,
                ),
            ],
        ),
    ]

from django.contrib.auth import get_user_model
from django.db import transaction

from baserow.core.models import GroupUser
from baserow.core.user.exceptions import UserAlreadyExist
from baserow.core.user.handler import UserHandler

User = get_user_model()


@transaction.atomic
def load_test_data():

    print("Add basic users...")
    user_handler = UserHandler()

    for i in range(3):
        # Create main admin
        email = f"admin{i + 1}@baserow.io" if i > 0 else "admin@baserow.io"
        try:
            admin = user_handler.create_user(f"Admin {i}", email, "password")
        except UserAlreadyExist:
            admin = User.objects.get(email=email)

        admin.is_staff = True
        admin.save()

        group = admin.groupuser_set.all().order_by("id").first().group
        group.name = f"Acme Corp ({i +1})" if i > 0 else "Acme Corp"
        group.save()

        # Create a second admin for the group
        email = f"admin{i + 1}_bis@baserow.io" if i > 0 else "admin_bis@baserow.io"
        try:
            admin_bis = user_handler.create_user(f"Admin {i+1} bis", email, "password")
        except UserAlreadyExist:
            admin_bis = User.objects.get(email=email)
        GroupUser.objects.update_or_create(
            group=group, user=admin_bis, defaults=dict(permissions="ADMIN", order=2)
        )

        for j in range(3):
            member_email_prefix = f"member{i+1}" if j > 0 else "member"
            member_email_prefix = (
                f"{member_email_prefix}_{j+1}" if i > 0 else member_email_prefix
            )
            member_email = f"{member_email_prefix}@baserow.io"
            try:
                member = user_handler.create_user(
                    f"Member {i+1} {j+1}", member_email, "password"
                )
            except UserAlreadyExist:
                member = User.objects.get(email=member_email)

            GroupUser.objects.update_or_create(
                group=group,
                user=member,
                defaults=dict(permissions="MEMBER", order=j + 2),
            )
